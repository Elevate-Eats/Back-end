/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('completetransactions', (table) => {
    table.increments('id').primary(); // Automatically managed auto-incrementing ID
    table.integer('transactionid').unsigned().notNullable();
    table.foreign('transactionid').references('transactions.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.timestamp('completed_at').defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw('DROP TRIGGER IF EXISTS trigger_update_daily_analytics ON completetransactions;')
    // Then, drop the function
    .then(() => knex.raw('DROP FUNCTION IF EXISTS update_daily_analytics();'))
    .then(() => knex.schema.dropTableIfExists('completetransactions'));
};
