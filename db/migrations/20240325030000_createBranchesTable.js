/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('branches', (table) => {
    table.increments('id').primary();
    table.string('name', 100);
    table.text('address');
    table.integer('totalemployee');
    table.integer('companyid').unsigned();
    table.string('phone', 15);
    table.integer('managerid').unsigned();
    table.string('profilepicname');

    // Foreign key constraints
    table.foreign('companyid').references('id').inTable('companies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('branches');
};
