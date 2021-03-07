import path from 'path';

module.exports = {
	development: {
		client: 'postgresql',
		connection: {
			host: 'localhost',
			database: 'personal',
			user: 'postgres',
			password: 'postgres'
		},
		pool: {
			min: 0,
			max: 20
		},
		migrations: {
			directory: path.resolve(__dirname, 'migrations')
		}
	},

	production: {
		client: 'postgresql',
		connection: {
			host: process.env.DATABASE_ADDRESS,
			database: 'idflow',
			user: 'postgres',
			password: 'postgres'
		},
		migrations: {
			directory: path.resolve(__dirname, 'migrations')
		}
	}
};
