/**
 * Seeds data for the items table, inserting all entries together.
 *
 * @param {import("knex").Knex} knex - The Knex connection object.
 */
exports.seed = (knex) => knex('items').del()
  .then(() => knex('items').insert([
    // Transaction 1 Items
    {
      count: 1, menuid: 1, transactionid: 1, pricingcategory: 'standard',
    },
    {
      count: 2, menuid: 2, transactionid: 1, pricingcategory: 'standard',
    },
    {
      count: 3, menuid: 3, transactionid: 1, pricingcategory: 'standard',
    },

    // Transaction 2 Items
    {
      count: 1, menuid: 1, transactionid: 2, pricingcategory: 'standard',
    },
    {
      count: 2, menuid: 2, transactionid: 2, pricingcategory: 'standard',
    },
    {
      count: 3, menuid: 3, transactionid: 2, pricingcategory: 'standard',
    },

    // Transaction 3 Items
    {
      count: 1, menuid: 1, transactionid: 3, pricingcategory: 'standard',
    },
    {
      count: 2, menuid: 2, transactionid: 3, pricingcategory: 'standard',
    },
    {
      count: 3, menuid: 3, transactionid: 3, pricingcategory: 'standard',
    },
  ]))
  // Add a .catch() block to handle potential errors
  .catch((error) => {
    console.error(`Error seeding data for items: ${error}`);
  });
