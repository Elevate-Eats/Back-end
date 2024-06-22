/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('menubranch', (table) => {
    table.integer('menuid').unsigned().notNullable();
    table.integer('branchid').unsigned().notNullable();
    table.float('baseprice');
    table.float('baseonlineprice');
    table.string('category');
    table.string('name');

    // Primary Key
    table.primary(['menuid', 'branchid']);

    // Foreign Key Constraints
    table.foreign('branchid').references('id').inTable('branches')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('menuid').references('id').inTable('menus')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('menubranch');
};
