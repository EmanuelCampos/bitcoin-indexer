import Sequelize from 'sequelize';

export const sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
        pool: {
            max: 10,
            min: 0,
            idle: 300000,
            acquire: 300000
        },
        host: process.env.PGHOST,
        dialect: 'postgres',
        logging: false,
        retry: 5
    }
);