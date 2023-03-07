import express from "express";
import { Express as NativeExpress } from "express";
import { ErrorHandlerMiddleware, MorganMiddleware } from "@middlewares";
import { Logger, env } from "@providers";
import { Server } from "http";
import { Router } from "@routes";

class Express {
    private _express: NativeExpress;
    private _server?: Server;

    constructor() {
        this._express = express();

        this.middlewares();
        this.routes();
        this.handler();
    }

    public middlewares(): void {
        this._express.use(express.json());
        this._express.use(express.urlencoded({ extended: true }));

        MorganMiddleware.mount(this._express);
    }

    public routes(): void {
        this._express.use(env.API_ROUTE_PREFIX, Router.mount());
    }

    public handler(): void {
        ErrorHandlerMiddleware.catch(this._express);
        this._express.use(ErrorHandlerMiddleware.logger);
        this._express.use(ErrorHandlerMiddleware.handler);
    }

    public listen(): void {
        this._server = this._express.listen(env.API_PORT, (err?: any) => {
            if (err) throw err;
            Logger.info(`> Ready on ${env.API_HOST}:${env.API_PORT}`);
        });
    }

    public close(): void {
        if (this._server) this._server.close();
    }
}

export default Express;
