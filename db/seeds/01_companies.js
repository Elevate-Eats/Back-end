/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = (knex) => knex('companies').del() // Delete existing entries to avoid duplicates
  .then(() => knex('companies').insert([
    { name: 'Balibul' },
    { name: 'Alibata' },
    { name: 'Garma Fried Chicken' },
    { name: 'Baso Aci Pun' },
    { name: 'Starling' },
  ]))
  .catch((error) => {
    console.error(`Error seeding data: ${error}`);
  });
