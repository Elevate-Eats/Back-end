/**
 * Seeds data for the branches table, associating each branch with a store manager.
 *
 * @param {import("knex").Knex} knex - The Knex connection object.
 * @returns {Promise<void>} A promise that resolves when the seed operation is complete.
 */
exports.seed = (knex) => knex('branches').del()
  .then(() => knex('branches').insert([
    // Branches for Company 1
    {
      name: 'Solo Store',
      address: 'Jalan Ahmad Yani 219, Kartasura',
      companyid: 1,
      phone: '+6282224000250',
      managerid: 4,
    },
    {
      name: 'Wates Store',
      address: 'Jalan Wates, Yogyakarta',
      companyid: 1,
      phone: '+6285212345672',
      managerid: 5, 
    },
    {
      name: 'Jogja Store',
      address: 'Surabaya, East Java',
      companyid: 1,
      phone: '+6285212345673',
    },
    // Branches for Company 2
    {
      name: 'Klaten Store',
      address: 'Klaten, Central Java',
      companyid: 2,
      phone: '+6285212345675',
      managerid: 8,
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data: ${error}`);
  });
