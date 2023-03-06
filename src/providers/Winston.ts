import { env } from "@providers";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

class Winston {
    private _logger: winston.Logger;

    constructor() {
        winston.addColors({
            error: "red",
            warn: "yellow",
            info: "green",
            http: "magenta",
            debug: "white",
        });
        this._logger = winston.createLogger({
            level: env.isDevelopment ? "debug" : "warn",
            levels: { error: 0, warn: 1, info: 2, http: 3, debug: 4 },
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp(),
                winston.format.printf(
                    ({ timestamp, level, message, ...metadata }) => {
                        return `${timestamp} [${level}]: ${message}${
                            Object.keys(metadata).length
                                ? ` ${JSON.stringify(metadata)}`
                                : String()
                        }`;
                    },
                ),
            ),
            transports: [
                new winston.transports.Console(),
                new DailyRotateFile({
                    dirname: ".logs",
                    filename: "%DATE%.access.log",
                    datePattern: "YYYY-MM-DD",
                    maxSize: "20m",
                    maxFiles: "14d",
                    level: "info",
                }),
                new DailyRotateFile({
                    dirname: ".logs",
                    filename: "%DATE%.error.log",
                    datePattern: "YYYY-MM-DD",
                    maxSize: "20m",
                    maxFiles: "14d",
                    level: "error",
                }),
            ],
        });
    }

    public get logger(): winston.Logger {
        return this._logger;
    }
}

export default new Winston().logger;
