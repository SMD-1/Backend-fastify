const {
  LOGIN_USER,
  CREATE_USER,
  GENERATE_LOGIN_CODE,
  LOGIN_WITH_CODE,
} = require("./controllers/user-controller");
const {
  loginUserSchema,
  createUserSchema,
  generateLoginCodeSchema,
  loginWithCodeSchema,
} = require("./schemas/user-schema");

module.exports = async (app) => {
  app.route({
    method: "POST",
    url: "/v1/create/user",
    schema: createUserSchema,
    handler: CREATE_USER,
  });
  app.route({
    method: "POST",
    url: "/v1/login/user",
    schema: loginUserSchema,
    handler: LOGIN_USER,
  });
  app.route({
    method: "POST",
    url: "/v1/generate/login/code",
    schema: generateLoginCodeSchema,
    handler: GENERATE_LOGIN_CODE,
  });
  app.route({
    method: "POST",
    url: "/v1/login/code/:code",
    schema: loginWithCodeSchema,
    handler: LOGIN_WITH_CODE,
  });
};
