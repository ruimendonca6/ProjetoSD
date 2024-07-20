module.exports = {
  development: {
    client: "pg",
    connection: {
      host: "auth-db",
      port: "5432",
      user: "sd",
      password: "sd",
      database: "sd",
    },
    migrations: {
      directory: "./migrations",
    },
    seeds: {
      directory: "./seeds",
    },
  },
};
