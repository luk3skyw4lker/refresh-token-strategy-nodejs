import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.createTable('users_tokens', builder => {
		builder.increments('id').primary().notNullable();
		builder
			.integer('user_id')
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
			.onUpdate('CASCADE')
			.notNullable();
		builder.string('active_token').unique().notNullable();

		builder.timestamps(true, true);
	});
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable('users_tokens');
}
