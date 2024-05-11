/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('expenses', (table) => {
    table.increments('id').primary(); // Automatically managed auto-incrementing ID
    table.integer('count');
    table.float('price');
    table.float('total');
    table.string('name', 100);
    table.string('category', 100);
    table.date('date');
    table.text('notes');
    table.integer('branchid').unsigned();
    table.foreign('branchid').references('id').inTable('branches')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('expenses');
};
