import { FilmController } from "@controllers";
import { AuthMiddleware } from "@middlewares";
import { Router } from "express";

class FilmRoute {
    private _router: Router;

    constructor() {
        this._router = Router();
    }
    public router(): Router {
        this._router.get(
            "/",
            AuthMiddleware.isOMDBApiKey,
            FilmController.getFastAndFuriousFilms
        );
        this._router.get(
            "/pirates",
            AuthMiddleware.isOMDBApiKey,
            FilmController.getPiratesOfTheCaribbeanFilms
        );

        return this._router;
    }
}

export default new FilmRoute();
