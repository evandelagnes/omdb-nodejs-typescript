import { config } from "dotenv";
import { join } from "path";
import { cleanEnv, makeValidator, str } from "envalid";

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
    OMDB_API_KEY?: string;
    GOOGLE_SPREADSHEET_FILE_ID: string;
    GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
    GOOGLE_PRIVATE_KEY: string;
}

const route_prefix = makeValidator((x) => {
    if (x.length <= 0 || x === "/") return String();
    else if (/^\/[a-zA-Z0-9]*$/.test(x)) return x;
    else
        throw new Error(
            "Route prefix must start with a '/' and can have several characters/digits after it"
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
            GOOGLE_SPREADSHEET_FILE_ID: str(),
            GOOGLE_SERVICE_ACCOUNT_EMAIL: str(),
            GOOGLE_PRIVATE_KEY: str(),
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
