/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('menus', (table) => {
    table.increments('id').primary();
    table.string('name', 100);
    table.string('category', 50);
    table.float('baseprice');
    table.float('baseonlineprice');
    table.integer('companyid').unsigned();

    // Set up the foreign key constraint
    table.foreign('companyid').references('id').inTable('companies').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('menus');
};
