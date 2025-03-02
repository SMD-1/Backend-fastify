// Import the framework and instantiate it
const Fastify = require("fastify");
const { serverSetup } = require("./server_setup");
const fs = require("fs");
const path = require("path");
const PORT = 3000;

const urlPrefix = "/users";

const fastify = Fastify({ logger: true });

async function addRoutes(app, folderPath) {
  const routeDire = path.join(__dirname, folderPath); // + file
  fs.readdirSync(routeDire).forEach((routeFile) => {
    if (!routeFile.startsWith(".") && routeFile === "routes.js") {
      // Filter out hidden files
      const routePath = path.join(routeDire, routeFile);
      const route = require(routePath);
      app.register(route);
    }
  });
}

// Run the server!
(async () => {
  try {
    const server = await serverSetup(urlPrefix);

    // TODO: DB connections configuration

    const routeDirectory = "user_management/";
    await addRoutes(server, routeDirectory);
    server.ready((err) => {
      if (err) {
        console.log(err);
        throw err;
      }
      server.swagger();
    });
    await server
      .listen({ port: PORT, host: "0.0.0.0" })
      .then((address) => {
        console.log("Everything is Loaded..!");
        console.log(
          "Swagger URL: " + address + urlPrefix + "swagger/public/documentation"
        );
        console.log(
          "Check server status URL: " + address + urlPrefix + "/public/status"
        );
      })
      .catch((err) => {
        throw new Error("Failed to start the server.", err);
      });
  } catch (err) {
    fastify.log.error("Error while starting the Server", err);
    process.exit(1);
  }
})();
