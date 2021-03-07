import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users', builder => {
		builder.increments('id').primary().notNullable();
		builder.string('username').unique().notNullable();
		builder.string('salt').notNullable();
		builder.string('hash').notNullable();

		builder.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users');
}
