import { registerAs } from "@nestjs/config";

const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379";
const url = new URL(redisUrl);

export default registerAs("redis", () => ({
  host: url.hostname,
  port: parseInt(url.port ?? "6379", 10),
  password: process.env.REDIS_PASSWORD ?? url.password ?? undefined,
  url: redisUrl,
}));
