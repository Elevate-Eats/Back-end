/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('employees', (table) => {
    table.increments('id').primary();
    table.string('name', 100);
    table.float('salary');
    table.float('bonus');
    table.integer('branchid').unsigned();
    table.integer('companyid').unsigned();

    // Define foreign keys
    table.foreign('branchid').references('id').inTable('branches').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
    table.foreign('companyid').references('id').inTable('companies').onUpdate('NO ACTION')
      .onDelete('NO ACTION');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('employees');
};
