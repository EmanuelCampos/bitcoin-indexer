import Sequelize from 'sequelize';

import { sequelize as database } from '../../database';

export const Block = database.define('blocks', {
    hash: {
        type: Sequelize.STRING,
    },
    height: {
        type: Sequelize.INTEGER,
    },
    timestamp: {
        type: Sequelize.DATE,
    },
    transactions: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: []
    },
}, {
    timestamps: true
});