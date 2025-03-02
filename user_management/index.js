const { LOGIN_USER } = require("./controllers/user-controller");
const { loginUserSchema } = require("./schemas/user-schema");

module.exports = async (app) => {
  app.route({
    method: "POST",
    url: "v1/login",
    schema: loginUserSchema,
    handler: LOGIN_USER,
  });
};
