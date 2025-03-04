require("dotenv").config();

const config = {
  POSTGRESQL_APP_DB: {
    host: process.env.APP_DB_HOST || "127.0.0.1",
    database: process.env.APP_DB_NAME || "postgres",
    user: process.env.APP_DB_USER || "postgres",
    password: process.env.APP_DB_PASSWORD || "postgres",
    port: process.env.APP_DB_PORT || 5432,
    max_monnection: process.env.APP_DB_MAX_CONNECTIONS || 3000,
    debug: process.env.APP_DB_DEBUG_ENABLE === "true",
  },
};

const appDB = config.POSTGRESQL_APP_DB;
const APP_DB_CONFIG = {
  client: "postgres",
  pool: {
    min: parseInt(3),
    max: parseInt(appDB.max_monnection),
  },
  acquireConnectionTimeout: 30000,
  connection: {
    host: appDB.host,
    user: appDB.user,
    password: appDB.password,
    database: appDB.database,
    port: appDB.port,
  },
  asyncStackTraces: false,
  debug: appDB.debug,
  propagationError: false,
};

module.exports = {
  APP_DB_CONFIG,
  config,
};
