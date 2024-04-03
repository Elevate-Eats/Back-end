/**
 * Seeds data for the items table, inserting all entries together.
 *
 * @param {import("knex").Knex} knex - The Knex connection object.
 */
exports.seed = (knex) => knex('items').del()
  .then(() => knex('items').insert([
    // Items for Transaction 1
    {
      count: 2, menuid: 1, transactionid: 1, pricingcategory: 'base', price: 5000, totalprice: 10000, category: 'Makanan',
    },
    {
      count: 1, menuid: 2, transactionid: 1, pricingcategory: 'online', price: 2000, totalprice: 2000, category: 'Minuman',
    },
    {
      count: 3, menuid: 3, transactionid: 1, pricingcategory: 'base', price: 1000, totalprice: 3000, category: 'Lainnya',
    },

    // Items for Transaction 2
    {
      count: 1, menuid: 1, transactionid: 2, pricingcategory: 'base', price: 7000, totalprice: 7000, category: 'Makanan',
    },
    {
      count: 2, menuid: 2, transactionid: 2, pricingcategory: 'online', price: 2500, totalprice: 5000, category: 'Minuman',
    },
    {
      count: 1, menuid: 3, transactionid: 2, pricingcategory: 'base', price: 1500, totalprice: 1500, category: 'Lainnya',
    },

    // Items for Transaction 3
    {
      count: 2, menuid: 1, transactionid: 3, pricingcategory: 'base', price: 6000, totalprice: 12000, category: 'Makanan',
    },
    {
      count: 3, menuid: 2, transactionid: 3, pricingcategory: 'online', price: 3000, totalprice: 9000, category: 'Minuman',
    },
    {
      count: 1, menuid: 3, transactionid: 3, pricingcategory: 'base', price: 2000, totalprice: 2000, category: 'Lainnya',
    },
  ]))
  // Add a .catch() block to handle potential errors
  .catch((error) => {
    console.error(`Error seeding data for items: ${error}`);
  });
