const dbConfig = {
  client: 'pg',
  connection: {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: `${__dirname}/db/migrations`,
  },
  seeds: {
    directory: `${__dirname}/db/seeds`,
  },
};

module.exports = {
  development: dbConfig,
  staging: {
    ...dbConfig,
    // Add any staging-specific configuration here
  },
  production: {
    ...dbConfig,
    // Add any production-specific configuration here
  },
};
