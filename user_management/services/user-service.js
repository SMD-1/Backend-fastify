const { TABLES } = require("../../core/config/DB_TABLES");

const getUsers = async (app) => {
  try {
    const { TEST_PERSONS } = TABLES;
    const query = `select * from ${TEST_PERSONS}`;
    const response = await app.knex.raw(query);
    return response.rows;
  } catch (error) {
    return {
      message: error.message,
      error: error.stack,
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
    return {
      message: error.message,
      error: error.stack,
    };
  }
};

const getUserDetails = async (app, email) => {
  try {
    const { TABLE_USERS } = TABLES;

    const user = await app.knex.raw(
      `select username, email, mobile, first_name, middle_name,password, last_name from ${TABLE_USERS} where email = '${email}' and is_active = true;`
    );
    return user.rows ? user.rows[0] : [];
  } catch (err) {
    return {
      message: err.message,
      error: err.stack,
    };
  }
};

module.exports = { getUsers, createUser, getUserDetails };
