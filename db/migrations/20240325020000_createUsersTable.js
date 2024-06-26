/* eslint-disable func-names */
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 100);
    table.string('nickname', 50);
    table.string('email', 100).unique();
    table.string('password', 100);
    table.enu('role', ['general_manager', 'area_manager', 'store_manager']);
    table.string('branchaccess', 100);
    table.string('profilepicname');
    table.integer('companyid').unsigned();
    table.string('phone', 15);
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
  return knex.schema.dropTableIfExists('users');
};
