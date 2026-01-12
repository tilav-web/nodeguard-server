import { Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { redisConfig } from "src/configs/redis.config";

@Injectable()
export class RedisService {
    private client: Redis;

    async onModuleInit() {
        this.client = new Redis(redisConfig);

        this.client.on("error", (err) => {
            console.error("Redis error:", err);
        });

        await this.client.ping();
        console.log("Connected to Redis");
    }
}