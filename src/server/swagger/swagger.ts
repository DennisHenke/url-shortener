import fastifySwagger from "@fastify/swagger";
import { FastifyInstance } from "fastify";

export async function registerSwaggerMiddleware(
  fastifyInstance: FastifyInstance
) {
  await fastifyInstance.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.0",
      info: {
        title: "URL Shortener API",
        description: "API Endpoints for a URL Shortener Service",
        version: "v1.0.0",
      },
    },
  });
}
