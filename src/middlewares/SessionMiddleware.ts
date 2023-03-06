import connectRedis from "connect-redis";
import session, { SessionOptions } from "express-session";
import { Express } from "express";
import { env, Redis } from "@providers";

const RedisStore = connectRedis(session);

class SessionMiddleware {
    private _options: SessionOptions = {
        name: env.SESSION_NAME,
        secret: env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: env.isProduction,
        },
        saveUninitialized: true,
        resave: true,
    };

    public mount(express: Express) {
        const RedisClient = Redis.client;
        if (RedisClient == null)
            throw new Error("Redis Client has not been started.");

        this._options.store = new RedisStore({ client: RedisClient });
        express.use(session(this._options));
    }
}

export default new SessionMiddleware();
