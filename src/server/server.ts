import fastify from "fastify";
import { registerSwaggerMiddleware } from "./swagger/swagger.js";
import { registerViteMiddleware } from "./vite/vite.js";

const server = fastify();

// Swagger Middleware to add OpenAPI documentation and Swagger UI
registerSwaggerMiddleware(server);

// Configure and initialize Vite Middleware to serve SPA
const viteConfigUrl = new URL(
  "../../vite.config.ts",
  import.meta.url
).toString();

await registerViteMiddleware(server, {
  dev: true,
  servePath: "/",
  viteConfigUrl: viteConfigUrl,
});

const port =
  process.env.SERVER_PORT && isFinite(parseInt(process.env.SERVER_PORT, 10))
    ? parseInt(process.env.SERVER_PORT, 10)
    : 3000;

server.listen({ port, host: "0.0.0.0" });
