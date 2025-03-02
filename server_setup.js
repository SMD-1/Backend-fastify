const fastify = require("fastify");
const cors = require("@fastify/cors");
const helmet = require("@fastify/helmet");
const swagger = require("@fastify/swagger");
const swaggerUI = require("@fastify/swagger-ui");
const underPressure = require("@fastify/under-pressure");
const Ajv = require("ajv");
const AjvErrors = require("ajv-errors");
const addFormats = require("ajv-formats");

async function serverSetup(swaggerURL) {
  const app = fastify({
    logger: true,
    // genReqId: (req) => req.headers["x-request-id"] || uuid(),
    // disableRequestLogging: true,
    bodyLimit: 2000000, // Setting body limit to 2 MB
  });

  app.register(cors);
  app.register(helmet, helmetConfig);
  app.register(swagger, swaggerConfig(swaggerURL));
  app.register(swaggerUI, {
    routePrefix: swaggerURL + "swagger/public/documentation",
  });
  console.log("=========", swaggerConfig(swaggerURL));
  await ajvCompiler(app, {});

  return app;
}

async function ajvCompiler(app, options) {
  const ajv = new Ajv({
    removeAdditional: true,
    useDefaults: true,
    coerceTypes: true,
    allErrors: true,
    allowUnionTypes: true,
    // Additional options go here
    strict: false, // Example additional option

    // ... add more options as needed
  });
  AjvErrors(ajv);
  addFormats(ajv);
  app.setValidatorCompiler(({ schema }) => {
    return ajv.compile(schema);
  });
}

const helmetConfig = {
  noCache: true,
  policy: "same-origin",
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self' 'unsafe-inline'"],
    },
  },
};

function getAllRoutes(filePath, routes = []) {
  const stats = fs.statSync(filePath);

  if (stats.isDirectory()) {
    const files = fs.readdirSync(filePath);
    files.forEach((file) => {
      if (file !== "node_modules") {
        const fullPath = path.join(filePath, file);
        if (!file.startsWith(".")) {
          getAllRoutes(fullPath, routes);
        }
      }
    });
  } else if (stats.isFile() && path.basename(filePath) === "routes.js") {
    routes.push(filePath);
  }
  return routes;
}

const swaggerConfig = (url) => {
  url = url || "qpf";
  return {
    routePrefix: url + "swagger/public/documentation",
    swagger: {
      info: {
        title: "User management",
        description: "Swagger for the project",
        version: "1.0.0",
      },
      schemes: ["http", "https"],
      rbac: ["*"],
      consumes: [
        "application/json",
        "application/x-www-form-urlencoded",
        "application/xml",
        "text/xml",
      ],
      produces: [
        "application/json",
        "application/javascript",
        "application/xml",
        "text/xml",
        "text/javascript",
      ],

      securityDefinitions: {
        ApiToken: {
          description: 'Authorization header token, sample: "Bearer #TOKEN#"',
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
        StaticToken: {
          description: 'Add the Static token : "Static Token"',
          type: "apiKey",
          name: "qp-tc-request-id",
          in: "header",
        },
      },
    },
    exposeRoute: true,
  };
};

module.exports = { serverSetup, getAllRoutes };
