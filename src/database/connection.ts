import knex from 'knex';

const config = require('./knexfile');

const environment = process.env.NODE_ENV || 'development';

const connection = knex(config[environment]);

export default connection;
