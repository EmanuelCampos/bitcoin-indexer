import { Transaction } from './TransactionModel';

export const insertTransaction = (transaction) => {
    const { 
        txid, 
        hash,
        vout,
    } = transaction

    const opReturn = vout.find((output) => {
        return output.scriptPubKey.asm.startsWith('OP_RETURN');
    });

    const formattedOpReturn = opReturn ? opReturn.scriptPubKey.asm.split(' ')[1] : null;

    Transaction.upsert({
        txId: txid.toLowerCase(),
        hash,
        opReturn: formattedOpReturn,
    })
}