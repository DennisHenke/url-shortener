import { FastifyInstance } from "fastify";
//import { createServer as createViteServer } from "vite";
// @ts-expect-error
import FastifyVite from "@fastify/vite";

type ViteMiddlewareOptions = {
  dev: boolean;
  servePath: string;
  viteConfigUrl: string;
};

declare module "fastify" {
  interface FastifyInstance {
    vite: {
      ready: () => Promise<void>;
    };
  }

  interface FastifyReply {
    html: () => {};
  }
}

export async function registerViteMiddleware(
  fastifyInstance: FastifyInstance,
  { dev, servePath, viteConfigUrl }: ViteMiddlewareOptions
) {
  fastifyInstance.register(FastifyVite, {
    root: viteConfigUrl,
    dev,
    spa: true,
  });

  fastifyInstance.get(servePath, (_req, reply) => {
    reply.html();
  });

  await new Promise((resolve) => setTimeout(resolve, 1000));
  await fastifyInstance.vite.ready();
  /*const vite = await createViteServer({
    server: {
      middlewareMode: true,
    },
    appType: "spa",
  });
  fastifyInstance.register(vite.middlewares);*/
}
