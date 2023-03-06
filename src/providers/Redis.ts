import { createClient, RedisClientType } from "redis";
import { Logger, env } from "@providers";

class Redis {
    private _client?: RedisClientType;

    public init() {
        if (!this._client) {
            this._client = createClient({
                url: `${env.REDIS_HOST}:${env.REDIS_PORT}`,
                legacyMode: true,
            });
            this._client.connect();
            this.log();
        }
    }

    public get client(): RedisClientType | undefined {
        return this._client;
    }

    private log() {
        this._client!.on("error", (err) => {
            Logger.error("Could not establish a connection with redis.", {
                error: err,
            });
            throw new Error("Redis Connection failed.");
        });
        this._client!.on("connect", (err) =>
            Logger.info("Connected to redis successfully"),
        );
    }
}

export default new Redis();
