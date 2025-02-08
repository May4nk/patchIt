import { createClient } from "redis";
type redisactiontype = "HGET" | "HSET" | "HGETALL" | "GET" | "SET";

const redisClient = createClient();

redisClient.connect().catch(() => console.log("error: redis failed to cache"));

export const fromCache = async (
  action: redisactiontype,
  hKey: string,
  objKey?: string,
  objValule?: string,
  expiresIn?: number
) => {
  if (!redisClient.isOpen) {
    throw new Error("Redis client is closed");
  }

  switch (action) {
    case "HSET":
      await redisClient.hSet(hKey, objKey!, objValule!);
      if (expiresIn) {
        await redisClient.expire(hKey, expiresIn);
      }

      return true;

    case "HGET":
      const getOne = await redisClient.hGet(hKey, objKey!);
      return getOne;

    case "HGETALL":
      const getAll = await redisClient.hGetAll(hKey);
      return getAll;

    case "GET":
      const get = await redisClient.get(hKey);
      return get;

    default:
      throw new Error("Invalid action");
  }
};
