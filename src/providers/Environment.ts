import { config } from "dotenv";
import { join } from "path";
import { cleanEnv, host, makeValidator, port, str } from "envalid";

config({
    path: join(process.cwd(), ".env"),
});

interface IEnvironment {
    isProduction?: boolean;
    isDevelopment?: boolean;
    isTest?: boolean;
    NODE_ENV: string;
    API_HOST: string;
    API_PORT: number;
    API_ROUTE_PREFIX: string;
    MYSQL_HOST: string;
    MYSQL_PORT: number;
    MYSQL_USERNAME: string;
    MYSQL_PASSWORD: string;
    MYSQL_URL: string;
    MYSQL_ROOT_PASSWORD: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_PASSWORD: string;
    SESSION_NAME: string;
    SESSION_SECRET: string;
    COOKIE_DOMAIN: string | undefined;
}

const route_prefix = makeValidator((x) => {
    if (x.length <= 0 || x === "/") return String();
    else if (/^\/[a-zA-Z0-9]*$/.test(x)) return x;
    else
        throw new Error(
            "Route prefix must start with a '/' and can have several characters/digits after it",
        );
});

const api_port = makeValidator((x) => {
    const coerced: number = +x;
    if (
        Number.isNaN(coerced) ||
        coerced.toString() !== x ||
        coerced % 1 !== 0 ||
        coerced < 1 ||
        coerced > 65535
    ) {
        throw new Error(`Invalid port input: ${x}`);
    }
    return coerced;
});

class Environment {
    private _env: IEnvironment;

    constructor() {
        this._env = <IEnvironment>cleanEnv(process.env, {
            NODE_ENV: str({
                choices: ["development", "production", "test"],
            }),
            API_HOST: str(),
            API_PORT: api_port(),
            API_ROUTE_PREFIX: route_prefix(),
            MYSQL_HOST: host(),
            MYSQL_PORT: port(),
            MYSQL_USERNAME: str(),
            MYSQL_PASSWORD: str(),
            MYSQL_URL: str(),
            MYSQL_ROOT_PASSWORD: str(),
            REDIS_HOST: str(),
            REDIS_PORT: port(),
            REDIS_PASSWORD: str(),
            SESSION_NAME: str(),
            SESSION_SECRET: str(),
            COOKIE_DOMAIN: str({ default: "" }),
        });
        this._env = {
            ...this._env,
            isProduction: this._env.NODE_ENV === "production",
            isDevelopment: this._env.NODE_ENV === "development",
            isTest: this._env.NODE_ENV === "test",
        };
    }

    public get env(): IEnvironment {
        return this._env;
    }
}

export default new Environment().env;
