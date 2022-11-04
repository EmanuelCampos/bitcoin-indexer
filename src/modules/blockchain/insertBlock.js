import { Transaction } from './TransactionModel';
import { Block } from './BlockModel';

const syncTransactionAndBlock = (txId, hash) => {
    Transaction.upsert({ txId, blockHash: hash });
}

export const insertBlock = async (block) => {
    const { 
        hash, 
        height,
        time,
        tx
    } = block

    for (let txId of block.tx) {
        syncTransactionAndBlock(txId, hash);
    }

    Block.create({
        hash: hash,
        height,
        timestamp: time,
        transactions: tx
    })
}