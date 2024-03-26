/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.timestamp('transactiondate');
    table.float('discount');
    table.string('paymentmethod', 25);
    table.float('totalprice');
    table.integer('branchid').unsigned();
    table.string('customername');
    table.integer('tablenumber');
    table.integer('status');
    table.integer('companyid').unsigned();

    // Define foreign key constraints
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
  return knex.schema.dropTableIfExists('transactions');
};
