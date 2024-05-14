// seeds/01_transactions.js
/**
 * Seeds the transactions table with example data.
 * @param {import("knex").Knex} knex The Knex connection object.
 */
const jakartaOffset = 7; // Jakarta is UTC+7
const now = new Date();
const jakartaTime = new Date(now.getTime() + jakartaOffset * 3600 * 1000);

exports.seed = (knex) => knex('transactions').del()
  .then(() => knex('transactions').insert([
    {
      transactiondate: jakartaTime, // Use the adjusted time
      discount: 10,
      paymentmethod: 'cash',
      totalprice: 16000,
      branchid: 1,
      customername: 'Alice',
      tablenumber: 1,
      status: 1,
      companyid: 1,
    },
    {
      transactiondate: jakartaTime, // Use the adjusted time
      discount: 5,
      paymentmethod: 'credit card',
      totalprice: 24000,
      branchid: 1,
      customername: 'Bob',
      tablenumber: 2,
      status: 1,
      companyid: 1,
    },
    {
      transactiondate: jakartaTime, // Use the adjusted time
      discount: 15,
      paymentmethod: 'online',
      totalprice: 32000,
      branchid: 1,
      customername: 'Charlie',
      tablenumber: 3,
      status: 1,
      companyid: 1,
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data for transactions: ${error}`);
  });
