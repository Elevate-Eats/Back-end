/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.integer('count');
    table.float('price');
    table.float('totalprice');
    table.integer('menuid').unsigned();
    table.integer('transactionid').unsigned();
    table.string('category');
    table.string('pricingcategory');
    // Foreign key constraints
    table.foreign('menuid').references('id').inTable('menus').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
    table.foreign('transactionid').references('id').inTable('transactions').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  // Drop the table
  return knex.schema.dropTableIfExists('items');
};
