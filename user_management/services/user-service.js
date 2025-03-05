const { TABLES } = require("../../core/config/DB_TABLES");

const getUsers = async (app) => {
  try {
    const { TEST_PERSONS } = TABLES;
    const query = `select * from ${TEST_PERSONS}`;
    const response = await app.knex.raw(query);
    return response.rows;
  } catch (error) {
    return {
      message: "Error occured while fetching data.",
      error: error,
    };
  }
};

const createUser = async (app, userDetails) => {
  try {
    const response = await app.knex
      .insert(userDetails)
      .into("users")
      .returning("*");
    return response;
  } catch (error) {
    console.log(error);
    return {
      message: "Error occured while fetching data.",
      error: error,
    };
  }
};

const getUserDetails = async (app, username) => {
  try {
    const { USERS } = TABLES;

    const user = await app.knex.raw(
      `select username, email, mobile, first_name, middle_name,password, last_name from ${USERS} where username = '${username}';`
    );
    return user.rows ? user.rows[0] : {};
  } catch (err) {
    return {
      message: "Error occured while fetching data.",
      error: err,
    };
  }
};

module.exports = { getUsers, createUser, getUserDetails };
