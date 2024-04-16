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
    table.index('transactionid');
    table.index(['transactionid', 'menuid'], 'idx_items_on_transaction_menu');
    // Foreign key constraints
    table.foreign('menuid').references('id').inTable('menus')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('transactionid').references('id').inTable('transactions')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
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
