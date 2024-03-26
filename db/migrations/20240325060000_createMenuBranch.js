/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('menubranch', (table) => {
    // Note: Knex does not support auto incrementing on non-primary key.
    // If menuid isn't intended as an auto-increment PK,
    // you might need a different setup or manual handling for its value.
    table.integer('menuid').unsigned().notNullable();
    table.integer('branchid').unsigned().notNullable();
    table.float('baseprice');
    table.float('baseonlineprice');
    table.string('category');
    table.string('name');

    // Primary Key
    table.primary(['menuid', 'branchid']);

    // Foreign Key Constraints
    table.foreign('branchid').references('id').inTable('branches').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
    table.foreign('menuid').references('id').inTable('menus').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('menubranch');
};
