const { TABLES } = require("../../core/DB_TABLES");

const getUsers = async (app) => {
  try {
    const { TEST_PERSONS } = TABLES;
    const query = `select * from ${TEST_PERSONS}`;
    const response = await app.knex.raw(query);
    return response.rows;
  } catch (error) {
    return {
      message: "Error occured while fetching data.",
    };
  }
};

module.exports = { getUsers };
