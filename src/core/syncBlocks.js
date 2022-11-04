import { Op } from "sequelize";
import async from 'async';

import { rpc } from '../zmq';

import { Block } from '../modules/blockchain/BlockModel';
import { Transaction } from '../modules/blockchain/TransactionModel';

const getBlockHash = (i) => rpc.getBlockHash(i);

const getBlock = (blockHash) => rpc.getBlock(blockHash);

const getTransaction = async(txId) => rpc.getRawTransaction(txId, 1);

const batchTransactions = async (blocks) => { 
    const blocksPerChunk = 1000;
    
    for (let i = 0; i < blocks.length; i += blocksPerChunk) {
        const currentBlocksChunk = blocks.slice(i, i + blocksPerChunk);

        function transactionCallback() {
            for(let block of currentBlocksChunk) {
                let noDuplicatedTransactions = [...new Set(block.tx)];
                for(let txn of noDuplicatedTransactions) {
                    getTransaction(txn);
                }
            }
        }

        rpc.batch(transactionCallback, async (err, rawTxns) => {
            if(!rawTxns) return;
            if(rawTxns.length === 0) return;
    
            const existentTransactions = rawTxns.filter((txn) => txn.result != null)
        
            const rawTransactions = existentTransactions.map(txn => {
                const { txid: txId , hash, vout } = txn.result;

                let opReturn = null;
                
                if(txn && vout[1]) {                            
                    opReturn = vout[1].scriptPubKey.asm;
                }
            
                const opReturnHexCode = opReturn ? opReturn.split(' ')[1] : null;
    
                return {
                    txId,
                    hash,
                    opReturn: opReturnHexCode,
                    blockHash: (currentBlocksChunk.find((block) => block.tx.includes(txId))).hash
                }
            });
        
            await Transaction.bulkCreate(rawTransactions)

            console.log(rawTransactions.length, "Transactions added")
        });
    }
}

export const syncBlocks = async () => {  
    let nonExistentBlocks;
    let blockHashes;

    const syncBlocksCallback = {
        getBlockHash: async () => {
            for(let block of nonExistentBlocks) {
                getBlockHash(block);
            }
        },
        getBlock: async () => {
            for(let block of blockHashes) {
                getBlock(block.result);
            }
        }
    }
    
    rpc.getBlockCount(async (err, { result: latestBlockInNetwork}) => {
        if(err !== null) return;

        const blocksInNetwork = Array.from(Array(latestBlockInNetwork).keys());
        
        const existentBlocks =  await Block.findAll({ 
            where: { height: { [Op.in]: blocksInNetwork } }
        });
    
        nonExistentBlocks = blocksInNetwork.filter((block) => {
            return !existentBlocks.some((b) => b.height === block);
        });   

        rpc.batch(syncBlocksCallback.getBlockHash, (err, rx) => {
            blockHashes = rx

            rpc.batch(syncBlocksCallback.getBlock, async (err, blocks) => {       
                const rawBlocks = blocks.map((block) => ({
                        ...block.result,
                        timestamp: block.result.time,
                        transactions: block.result.tx
                }));

                const insertionsPerChunk = 5000;

                for (let i = 0; i < rawBlocks.length; i += insertionsPerChunk) {
                    const chunk = rawBlocks.slice(i, i + insertionsPerChunk);

                    let concurrentBlockInsertion = async.cargo(function (tasks) {
                        Block.bulkCreate(tasks)
                        batchTransactions(chunk)
                    }, 20000);
        
                    concurrentBlockInsertion.push(chunk, function (err) {
                        if (err) console.log("error inserting blocks", err)
                    });
                }
            })
        })
    });
}
