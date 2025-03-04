const { getUsers } = require("../services/user-service");

async function LOGIN_USER(request, reply) {
  try {
    console.log("request.body", request.body);
    const users = await getUsers(this);
    return reply.code(200).send(users);
  } catch (error) {
    console.error("Something went Wrong!", error);
  }
}

module.exports = {
  LOGIN_USER,
};
