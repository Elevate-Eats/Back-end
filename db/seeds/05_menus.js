/**
 * Seeds data for the menus table, focusing on a Goat Satay restaurant's menu items.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = (knex) => knex('menus').del()
  .then(() => knex('menus').insert([
    // Makanan (Food)
    {
      name: 'Sate Kambing', category: 'Makanan', baseprice: 20000, baseonlineprice: 25000, companyid: 1,
    },
    {
      name: 'Gulai Kambing', category: 'Makanan', baseprice: 30000, baseonlineprice: 35000, companyid: 1,
    },
    {
      name: 'Tongseng Kambing', category: 'Makanan', baseprice: 25000, baseonlineprice: 30000, companyid: 1,
    },

    // Minuman (Drinks)
    {
      name: 'Es Teh Manis', category: 'Minuman', baseprice: 5000, baseonlineprice: 7000, companyid: 1,
    },
    {
      name: 'Es Jeruk', category: 'Minuman', baseprice: 5000, baseonlineprice: 7000, companyid: 1,
    },

    // Lainnya (Others)
    {
      name: 'Nasi Putih', category: 'Lainnya', baseprice: 5000, baseonlineprice: 5000, companyid: 1,
    },
    {
      name: 'Lontong', category: 'Lainnya', baseprice: 4000, baseonlineprice: 4000, companyid: 1,
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data: ${error}`);
  });
