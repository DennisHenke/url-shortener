import redisClient from "../redis/redis.js";
import baseX from "base-x";
import crypto from "node:crypto";
import { IShortUrl } from "./short-url.js";

const SHORT_URL_KEY_PREFIX = "short_url";
const LONG_URL_KEY_PREFIX = "long_url";

const base58 = baseX(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);

function generateRandomId(): string {
  const randomArray = new Uint8Array(6);
  crypto.getRandomValues(randomArray);
  return base58.encode(randomArray);
}

async function getUnusedId(): Promise<string> {
  while (true) {
    const randomId = generateRandomId();
    const keysExists = await redisClient.exists(randomId);
    if (keysExists === 0) {
      return randomId;
    }
  }
}

export async function getShortUrlObjectByShortUrl(
  shortUrl: string
): Promise<IShortUrl | null> {
  const shortUrlFromRedis = await redisClient.hGetAll(
    `${SHORT_URL_KEY_PREFIX}:${shortUrl}`
  );

  if (!shortUrlFromRedis.longUrl) {
    return null;
  }

  return {
    id: shortUrl,
    longUrl: shortUrlFromRedis.longUrl,
    shortenedCount: parseInt(shortUrlFromRedis.shortenedCount, 10),
    visitedCount: parseInt(shortUrlFromRedis.visitedCount, 10),
    createdAt: shortUrlFromRedis.createdAt,
  };
}

export async function getShortUrlObjectByLongUrl(
  longUrl: string
): Promise<IShortUrl | null> {
  const shortUrl = await redisClient.get(`${LONG_URL_KEY_PREFIX}:${longUrl}`);
  if (!shortUrl) {
    return null;
  }

  return getShortUrlObjectByShortUrl(shortUrl);
}

export async function createShortUrlObject(
  longUrl: string
): Promise<IShortUrl> {
  // Check first if the url was already encoded previously.
  // That way, we can just return the already encoded part.
  const cleanLongUrl = longUrl.replace(/[/:.]+/g, "_");
  const searchByLongUrl = await getShortUrlObjectByLongUrl(cleanLongUrl);

  if (searchByLongUrl) {
    return searchByLongUrl;
  }

  let newId = await getUnusedId();
  const newShortUrlObject = {
    longUrl,
    shortenedCount: 0,
    visitedCount: 0,
    createdAt: new Date().toISOString(),
  };
  await redisClient.hSet(`${SHORT_URL_KEY_PREFIX}:${newId}`, newShortUrlObject);
  await redisClient.set(`${LONG_URL_KEY_PREFIX}:${cleanLongUrl}`, newId);

  return { ...newShortUrlObject, id: newId };
}

export async function incrementVisitedCount(shortUrl: string): Promise<void> {
  await redisClient.hIncrBy(
    `${SHORT_URL_KEY_PREFIX}:${shortUrl}`,
    "visitedCount",
    1
  );
}

export async function incrementShortenedCount(shortUrl: string): Promise<void> {
  await redisClient.hIncrBy(
    `${SHORT_URL_KEY_PREFIX}:${shortUrl}`,
    "shortenedCount",
    1
  );
}
