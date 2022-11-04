import { Transaction } from './TransactionModel';

export const getByOpReturn = async (ctx) => {
    const { id } = ctx.params;

    const transactions = await Transaction.findAll({
        where: {
            opReturn: id
        },
        attributes: ['txId', 'opReturn', 'blockHash']
    });

    if (transactions) {
        ctx.status = 200
        ctx.body = { payload: transactions }
        return;
    }

    ctx.status = 404;
    return ctx.body({ error: 'Transactions not found' });
}