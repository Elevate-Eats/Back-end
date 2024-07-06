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
    table.integer('cashierid').unsigned();
    table.index('branchid');
    table.index('transactiondate');
    // Define foreign key constraints
    table.foreign('branchid').references('id').inTable('branches')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('companyid').references('id').inTable('companies')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.foreign('cashierid').references('id').inTable('users')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions');
};
