import { FastifyInstance, FastifyPluginOptions } from "fastify";
// @ts-expect-error
import FastifyVite from "@fastify/vite";

type VitePluginOptions = {
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

export async function vitePlugin(
  fastifyInstance: FastifyInstance,
  { dev, servePath, viteConfigUrl }: FastifyPluginOptions & VitePluginOptions
) {
  await fastifyInstance.register(FastifyVite, {
    root: viteConfigUrl,
    dev,
    spa: true,
  });

  fastifyInstance.get(servePath, { schema: { hide: true } }, (_req, reply) => {
    reply.html();
  });

  await fastifyInstance.vite.ready();
}
