/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = (knex) => knex('users').del() // Chain directly to avoid unnecessary block
  .then(() => knex('users').insert([
    {
      name: 'Samuel Robert',
      nickname: 'Sam',
      email: 'sam@example.com',
      password: '$2a$08$/fH7qhTOPkGY5KTrk.KzheJLVRVOkfm/EKoT146L9fi45JCK4PuU.', // Remember, in real projects, hash passwords before seeding
      role: 'general_manager',
      branchaccess: '{all}',
      companyid: 1,
      phone: '+62813027864435',
    },
    {
      name: 'Evan Pradipta Hardinatha',
      nickname: 'Evan',
      email: 'evan@example.com',
      password: '$2a$08$TKePbhy7Rh3H4iwmFyF4EOEGEMAhsizv/xLFTbU3iNHRevwHyWbVi', // Remember to hash passwords in real projects
      role: 'area_manager',
      branchaccess: '{1,2,3}',
      companyid: 2,
      phone: '+62813027864435',
    },
    {
      name: 'General Manager 3',
      nickname: 'GM 3',
      email: 'gm3@gmail.com',
      password: '$2a$08$sNPChUQ2Mvvz4Pi7Q4YAFO/7FlBZeMJr8p67nnJfbEgL9MSTiO9qa', // Remember to hash passwords in real projects
      role: 'general_manager',
      branchaccess: '{all}',
      companyid: 3,
      phone: '+6285123456789',
    },
    // More users can be added here
  ]))
  // Add a .catch() block to handle potential errors
  .catch((error) => {
    console.error(`Error seeding data: ${error}`);
  });
