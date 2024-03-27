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
      name: 'Jakarta Store',
      address: 'Central Jakarta, Jakarta',
      companyid: 1,
      phone: '+6285212345671',
      managerid: 4, // Assuming this corresponds to Agus Setiawan
    },
    {
      name: 'Bandung Store',
      address: 'Bandung City, West Java',
      companyid: 1,
      phone: '+6285212345672',
      managerid: 5, // Assuming this corresponds to Budi Raharjo
    },
    {
      name: 'Surabaya Store',
      address: 'Surabaya, East Java',
      companyid: 1,
      phone: '+6285212345673',
      managerid: 6, // Assuming this corresponds to Citra Dewi
    },
    // Branches for Company 2
    {
      name: 'Yogyakarta Store',
      address: 'Yogyakarta, Special Region of Yogyakarta',
      companyid: 2,
      phone: '+6285212345674',
      managerid: 7, // Assuming this corresponds to Dian Sastro
    },
    {
      name: 'Semarang Store',
      address: 'Semarang, Central Java',
      companyid: 2,
      phone: '+6285212345675',
      managerid: 8, // Assuming this corresponds to Eko Wahyudi
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data: ${error}`);
  });
