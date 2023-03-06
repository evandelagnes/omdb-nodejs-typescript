import { Router as ExpressRouter } from "express";
import { UserRoute } from "@routes";

class Router {
    private _router: ExpressRouter;

    constructor() {
        this._router = ExpressRouter();
    }

    public mount(): ExpressRouter {
        this._router.use("/auth", UserRoute.router());

        return this._router;
    }
}

export default new Router();
