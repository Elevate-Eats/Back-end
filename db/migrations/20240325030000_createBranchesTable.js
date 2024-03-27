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

    // Foreign key constraints
    table.foreign('companyid').references('id').inTable('companies').onUpdate('NO ACTION')
      .onDelete('NO ACTION');

    // Assuming managerid is a foreign key, you would similarly set up a foreign key constraint
    // table.foreign('managerid').references('id').inTable('managers')
    // .onUpdate('NO ACTION').onDelete('NO ACTION');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('branches');
};
