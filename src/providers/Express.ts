import express from "express";
import passport from "passport";
import { Express as NativeExpress } from "express";
import {
    ErrorHandlerMiddleware,
    MorganMiddleware,
    PassportMiddleware,
    SessionMiddleware,
} from "@middlewares";
import { Logger, env, Redis } from "@providers";
import { Server } from "http";
import { Router } from "@routes";

class Express {
    private _express: NativeExpress;
    private _server?: Server;

    constructor() {
        this.init();

        this._express = express();

        this.middlewares();
        this.routes();
        this.handler();
    }

    public init() {
        Redis.init();
    }

    public middlewares(): void {
        this._express.use(express.json());
        this._express.use(express.urlencoded({ extended: true }));

        MorganMiddleware.mount(this._express);
        PassportMiddleware.mount();
        SessionMiddleware.mount(this._express);

        this._express.use(passport.initialize());
        this._express.use(passport.session());
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
