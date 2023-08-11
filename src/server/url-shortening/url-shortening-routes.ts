import { FastifyInstance, FastifyRequest } from "fastify";
import * as urlShorteningService from "./url-shortening-service.js";

type GetByShortUrlRequest = FastifyRequest<{
  Params: {
    shortUrl: string;
  };
}>;

type CreateShortUrlRequest = FastifyRequest<{
  Body: {
    longUrl: string;
  };
}>;

export default async function routes(
  fastify: FastifyInstance,
  _options: object
) {
  fastify.addSchema({
    $id: "ShortUrl",
    type: "object",
    properties: {
      id: {
        type: "string",
        example: "1JtTkzcy",
      },
      longUrl: {
        type: "string",
      },
      visitedCount: {
        type: "integer",
      },
      shortenedCount: {
        type: "integer",
      },
      createdAt: {
        type: "string",
        example: "2023-08-10T15:28:30.903Z",
      },
    },
  });

  fastify.get(
    "/shortened-url/:shortUrl",
    {
      schema: {
        description: "Retrieve the full url and analytics by the short url",
        operationId: "getByShortUrl",
        params: {
          shortUrl: {
            type: "string",
          },
        },
        response: {
          200: {
            description: "URL Object",
            $ref: "ShortUrl#",
          },
        },
      },
    },
    async (req: GetByShortUrlRequest, reply) => {
      const result = urlShorteningService.getShortUrlObjectByShortUrl(
        req.params.shortUrl
      );

      if (!result) {
        reply.status(404).send({ error: "Short URL not found" });
      }
      await urlShorteningService.incrementVisitedCount(req.params.shortUrl);
      return result;
    }
  );

  fastify.post(
    "/shortened-url",
    {
      schema: {
        description: "Shorten a URL",
        operationId: "createShortUrl",
        body: {
          type: "object",
          properties: {
            longUrl: {
              type: "string",
            },
          },
        },
        response: {
          201: {
            description: "Short URL created",
            $ref: "ShortUrl#",
          },
        },
      },
    },
    async (req: CreateShortUrlRequest, reply) => {
      try {
        new URL(req.body.longUrl);
      } catch (_error) {
        return reply.status(401).send({
          error: "Input is not a valid URL",
        });
      }

      const result = await urlShorteningService.createShortUrlObject(
        req.body.longUrl
      );
      await urlShorteningService.incrementShortenedCount(result.id);
      return result;
    }
  );
}
