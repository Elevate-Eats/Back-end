/**
 * Seeds data for the menubranch table, associating all menus for company 1 with branch ID 1
 * and keeping baseprice, baseonlineprice, and category the same as in the company level.
 *
 * @param {import("knex").Knex} knex - The Knex connection object.
 * @returns {Promise<void>} A promise that resolves when the seed operation is complete.
 */
exports.seed = (knex) => knex('menubranch').del()
  .then(() => knex('menus').where('companyid', 1))
  .then((menus) => {
    const menubranchInserts = menus.map((menu) => ({
      menuid: menu.id,
      branchid: 1,
      baseprice: menu.baseprice,
      baseonlineprice: menu.baseonlineprice,
      category: menu.category,
    }));

    return knex('menubranch').insert(menubranchInserts);
  })
  .catch((error) => {
    console.error(`Error seeding data for menubranch: ${error}`);
  });
