"use strict";

// const { errorHandler } = require("@quantela/core");
const userManagementRoutes = require("./index");

module.exports = async (app) => {
  app.register(userManagementRoutes, { prefix: "/user-management/" });
};
