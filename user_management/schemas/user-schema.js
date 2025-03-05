const { errorSchemas } = require("../../core/schema_validation");

const modelName = "User Management";

const createUserSchema = {
  tags: ["user"],
  summary: "User Registration and Login",
  description: `<h3>This API allows users to register, login, and manage their accounts.</h3>`,
  rbac: ["*"], // Roles or permissions (adjust as needed, e.g., ['admin', 'user'])
  body: {
    type: "object",
    properties: {
      username: {
        type: "string",
        minLength: 3,
        maxLength: 255,
        description: "Unique username for the user",
        pattern: "^[a-zA-Z0-9_]+$", // Only alphanumeric characters and underscores allowed
        example: "john_doe123",
      },
      password: {
        type: "string",
        minLength: 8,
        description: "User's password (hashed using bcrypt)",
        example: "user_password123",
      },
      email: {
        type: "string",
        format: "email", // Validates the email format
        pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$", // Regex to validate email
        description: "User's email address (unique)",
        example: "john.doe@example.com",
      },
      mobile: {
        type: "string",
        pattern: "^[0-9]{10,15}$", // Regex to validate mobile number format (10 to 15 digits)
        description: "User's mobile number (optional)",
        example: "1234567890",
      },
      first_name: {
        type: "string",
        maxLength: 255,
        description: "User's first name",
        example: "John",
      },
      middle_name: {
        type: "string",
        maxLength: 255,
        description: "User's middle name (optional)",
        example: "Michael",
      },
      last_name: {
        type: "string",
        maxLength: 255,
        description: "User's last name",
        example: "Doe",
      },
    },
    required: ["username", "password", "email"], // Make username, password, and email required
    additionalProperties: false,
  },
};

const loginUserSchema = {
  tags: ["user"],
  summary: "User Registration and Login",
  description: `<h3>This API allows users to register, login, and manage their accounts.</h3>`,
  rbac: ["*"], // Roles or permissions (adjust as needed, e.g., ['admin', 'user'])
  body: {
    type: "object",
    properties: {
      username: {
        type: "string",
        minLength: 3,
        maxLength: 255,
        description: "Unique username for the user",
        pattern: "^[a-zA-Z0-9_]+$", // Only alphanumeric characters and underscores allowed
        example: "john_doe123",
      },
      password: {
        type: "string",
        minLength: 8,
        description: "User's password (hashed using bcrypt)",
        example: "user_password123",
      },
    },
    required: ["username", "password"], // Make username, password, and email required
    additionalProperties: false,
  },
};

const generateLoginCodeSchema = {
  tags: ["user"],
  summary: "User Registration and Login",
  description: `<h3>This API allows users to register, login, and manage their accounts.</h3>`,
  rbac: ["*"], // Roles or permissions (adjust as needed, e.g., ['admin', 'user'])
  security: [{ ApiToken: [] }],
  body: {
    type: "object",
    properties: {
      token: {
        type: "string",
      },
    },
    required: ["token"], // Make username, password, and email required
    additionalProperties: false,
  },
};

const loginWithCodeSchema = {
  tags: ["user"],
  summary: "User Registration and Login",
  description: `<h3>This API allows users to register, login, and manage their accounts.</h3>`,
  rbac: ["*"], // Roles or permissions (adjust as needed, e.g., ['admin', 'user'])
  params: {
    type: "object",
    properties: {
      code: {
        type: "string",
      },
    },
    required: ["code"],
    additionalProperties: false,
  },
};

module.exports = {
  createUserSchema,
  loginUserSchema,
  generateLoginCodeSchema,
  loginWithCodeSchema,
};
