import Sequelize from 'sequelize';
import { sequelize as database } from '../../database';

export const Transaction = database.define('transactions', {
    txId: {
        type: Sequelize.STRING,
    },
    hash: {
        type: Sequelize.STRING,
    },
    blockHash: {
        type: Sequelize.STRING,
    },
    opReturn: {
        type: Sequelize.STRING,
    },
}, {
    timestamps: true
});