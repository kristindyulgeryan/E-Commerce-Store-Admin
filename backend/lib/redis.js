import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new Redis(process.env.UPSTASH_REDIS_URL);
await redis.set("foo", "bar");

// token: "ARvqAAImcDI3MGM4ZmM1YmQxYjQ0ZjI5YjA3MjU3MTk5YzhiNzUzZXAyNzE0Ng",
