/**
 * Seeds data for the completeTransactions table, inserting all entries together.
 *
 * @param {import("knex").Knex} knex - The Knex connection object.
 */
exports.seed = (knex) => knex('completetransactions').del()
  .then(() => knex('completetransactions').insert([
    // Transaction 1 Items
    {
      transactionid: 1,
    },
    {
      transactionid: 2,
    },
    {
      transactionid: 3,
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data for completeTransactions: ${error}`);
  });
