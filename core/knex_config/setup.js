"use strict";

const knex = require("knex");

const connectionCheck = (db) => db.raw("select 1+1 as result");

const getKnexClient = async ({ options }) => {
  try {
    const db = knex({ ...options });
    await connectionCheck(db);
    await connectionCheck(db);
    return db;
  } catch (exce) {
    console.log({ message: `DB connection failed`, err: exce });
    throw Error(`Connection Failed ${exce}`);
  }
};

module.exports = getKnexClient;
