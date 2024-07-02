/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = (knex) => knex('users').del() // Chain directly to avoid unnecessary block
  .then(() => knex('users').insert([
    {
      name: 'Paulus Tri Atmaja',
      nickname: 'Paulus',
      email: 'paulustriatmaja@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa', // Remember, in real projects, hash passwords before seeding
      role: 'general_manager',
      branchaccess: '{all}',
      companyid: 1,
      phone: '+62813027864435',
    },
    {
      name: 'Pujie Astuti',
      nickname: 'Pujie',
      email: 'pujiastuti1@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa', // Remember to hash passwords in real projects
      role: 'general_manager',
      branchaccess: '{all}',
      companyid: 1,
      phone: '+62813027864435',
    },
    {
      name: 'Developer Admin',
      nickname: 'devadmin',
      email: 'elevateeats2@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa', // Remember to hash passwords in real projects
      role: 'general_manager',
      branchaccess: '{all}',
      companyid: 1,
      phone: '+6285123456789',
    },
    {
      name: 'Hadasa Sri',
      nickname: 'Sri',
      email: 'hadasasri@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa',
      role: 'store_manager',
      branchaccess: '{1}',
      companyid: 1,
      phone: '+6285212345671',
    },
    {
      name: 'Tony',
      nickname: 'Tony',
      email: 'tony123@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa',
      role: 'store_manager',
      branchaccess: '{2}',
      companyid: 1,
      phone: '+6285212345672',
    },
    {
      name: 'Pramudya Hanung',
      nickname: 'Pram',
      email: 'pramudyahn1@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa',
      role: 'area_manager',
      branchaccess: '{1,2,3}',
      companyid: 1,
      phone: '+6285212345673',
    },
    {
      name: 'Donat',
      nickname: 'Donat',
      email: 'donatpedas@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa',
      role: 'general_manager',
      branchaccess: '{all}',
      companyid: 2,
      phone: '+6285212345674',
    },
    {
      name: 'Eko Wahyudi',
      nickname: 'Eko',
      email: 'eko.wahyudi@example.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa',
      role: 'store_manager',
      branchaccess: '{5}',
      companyid: 2,
      phone: '+6285212345675',
    },
  ]))
  .catch((error) => {
    console.error(`Error seeding data: ${error}`);
  });
