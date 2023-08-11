import fastify from "fastify";
import { swaggerPlugin } from "./swagger/swagger.js";
import { vitePlugin } from "./vite/vite.js";
import urlShorteningRoutes from "./url-shortening/url-shortening-routes.js";

//import fastifySwagger from "@fastify/swagger";
//import fastifySwaggerUi from "@fastify/swagger-ui";

const server = fastify();

// Swagger Plugin to add OpenAPI documentation and Swagger UI
//await server.register(swaggerPlugin);
await swaggerPlugin(server, {});

// API Routes
await server.register(urlShorteningRoutes, { prefix: "/api/v1" });

// Configure and initialize Vite Plugin to serve SPA
const viteConfigUrl = new URL(
  "../../vite.config.ts",
  import.meta.url
).toString();

await vitePlugin(server, {
  prefix: "/",
  dev: true,
  servePath: "/",
  viteConfigUrl: viteConfigUrl,
});

await server.ready();
server.swagger();

const port =
  process.env.SERVER_PORT && isFinite(parseInt(process.env.SERVER_PORT, 10))
    ? parseInt(process.env.SERVER_PORT, 10)
    : 3000;

await server.listen({ port, host: "0.0.0.0" });
console.log(`Server listening on port ${port}`);
