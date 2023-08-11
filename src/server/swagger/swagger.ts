import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

export async function swaggerPlugin(
  fastifyInstance: FastifyInstance,
  _options: FastifyPluginOptions
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

  fastifyInstance.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: (_request, _reply, next) => {
        next();
      },
      preHandler: (_request, _reply, next) => {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });
}
