const { errorSchemas } = require("../../core/qpf_schema");

const modelName = "User Management";

const loginUserSchema = {
  tags: [modelName],
  summary: "Get application records.",
  description: `<h3>This API allows logged in users to get application records.</h3>`,
  rbac: ["*"],
  body: {
    type: "object",
    properties: {},
  },
  additionalProperties: false,
  security: [{ ApiToken: [] }, { StaticToken: [] }],
  response: {
    ...errorSchemas,
  },
};

module.exports = {
  loginUserSchema,
};
