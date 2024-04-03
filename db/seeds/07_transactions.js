// seeds/01_transactions.js
/**
 * Seeds the transactions table with example data.
 * @param {import("knex").Knex} knex The Knex connection object.
 */
exports.seed = (knex) => knex('transactions').del()
  .then(() => knex('transactions').insert([
    {
      transactiondate: new Date(), discount: 10, paymentmethod: 'cash', totalprice: 16000, branchid: 1, customername: 'Alice', tablenumber: 1, status: 1, companyid: 1,
    },
    {
      transactiondate: new Date(), discount: 5, paymentmethod: 'credit card', totalprice: 24000, branchid: 1, customername: 'Bob', tablenumber: 2, status: 1, companyid: 1,
    },
    {
      transactiondate: new Date(), discount: 15, paymentmethod: 'online', totalprice: 32000, branchid: 1, customername: 'Charlie', tablenumber: 3, status: 1, companyid: 1,
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data for transactions: ${error}`);
  });
