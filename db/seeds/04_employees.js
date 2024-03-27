/**
 * Seeds data for the employees table, adding 3 employees for each branch of company 1.
 *
 * @param {import("knex").Knex} knex - The Knex connection object.
 * @returns {Promise<void>} A promise that resolves when the seed operation is complete.
 */
exports.seed = (knex) => knex('employees').where('companyid', 1).del()
  .then(() => knex('employees').insert([
    // Employees for Jakarta Store (Branch ID 1)
    {
      name: 'Ayu Dewi', salary: 7000000, bonus: 500000, branchid: 1, companyid: 1,
    },
    {
      name: 'Rahmat Gobel', salary: 7000000, bonus: 500000, branchid: 1, companyid: 1,
    },
    {
      name: 'Siti Badriah', salary: 7000000, bonus: 500000, branchid: 1, companyid: 1,
    },
    // Employees for Bandung Store (Branch ID 2)
    {
      name: 'Arief Muhammad', salary: 6500000, bonus: 450000, branchid: 2, companyid: 1,
    },
    {
      name: 'Dian Sastrowardoyo', salary: 6500000, bonus: 450000, branchid: 2, companyid: 1,
    },
    {
      name: 'Chelsea Islan', salary: 6500000, bonus: 450000, branchid: 2, companyid: 1,
    },
    // Employees for Surabaya Store (Branch ID 3)
    {
      name: 'Reza Rahadian', salary: 6000000, bonus: 400000, branchid: 3, companyid: 1,
    },
    {
      name: 'Adinia Wirasti', salary: 6000000, bonus: 400000, branchid: 3, companyid: 1,
    },
    {
      name: 'Tara Basro', salary: 6000000, bonus: 400000, branchid: 3, companyid: 1,
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data: ${error}`);
  });
