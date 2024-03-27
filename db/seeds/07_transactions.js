/**
 * Seeds data for the transactions table with three transactions for branch 1 and company 1.
 *
 * @param { import("knex").Knex } knex - The Knex connection object.
 * @returns { Promise<void> }
 */
exports.seed = (knex) => knex('transactions').del()
  .then(() => knex('transactions').insert([
    {
      transactiondate: new Date().toISOString(),
      discount: 0,
      paymentmethod: 'cash',
      totalprice: 0, // Initially set to 0, assuming items will be inserted separately
      branchid: 1,
      companyid: 1,
      customername: 'Customer A',
      tablenumber: 1,
      status: 1,
    },
    {
      transactiondate: new Date().toISOString(),
      discount: 0,
      paymentmethod: 'card',
      totalprice: 0, // Initially set to 0, assuming items will be inserted separately
      branchid: 1,
      companyid: 1,
      customername: 'Customer B',
      tablenumber: 2,
      status: 1,
    },
    {
      transactiondate: new Date().toISOString(),
      discount: 0,
      paymentmethod: 'online',
      totalprice: 0, // Initially set to 0, assuming items will be inserted separately
      branchid: 1,
      companyid: 1,
      customername: 'Customer C',
      tablenumber: 3,
      status: 1,
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data for transactions: ${error}`);
  });
