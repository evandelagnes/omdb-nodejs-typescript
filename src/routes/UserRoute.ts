import { UserController } from "@controllers";
import { Router } from "express";

class UserRoute {
    private _router: Router;

    constructor() {
        this._router = Router();
    }
    public router(): Router {
        this._router.post("/register", UserController.register);
        this._router.post("/login", UserController.login);
        this._router.get("/logout", UserController.logout);

        return this._router;
    }
}

export default new UserRoute();
