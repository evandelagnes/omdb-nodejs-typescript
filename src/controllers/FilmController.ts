import { NextFunction, Request, Response } from "express";
import { OMDB, SpreadSheet } from "@providers";
import { AxiosError } from "axios";
import { BadRequestException } from "@exceptions";
import fast_and_furious from "@config/fast_and_furious.json";
import pirates_of_the_caribbean from "@config/pirates_of_the_caribbean.json";
import star_wars from "@config/star_wars.json";

class FilmController {
    public async getFastAndFuriousFilms(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const fastAndFurious = new Array();

            // get details for each movies
            await Promise.all(
                fast_and_furious.map(async (movie) => {
                    const response = await OMDB.getMovieById(
                        movie.imdbID,
                        req.omdb_api_key
                    );
                    if (response.data.Response === "False") return;
                    fastAndFurious.push({
                        title: response.data.Title,
                        year: response.data.Year,
                        director: response.data.Director,
                        poster: response.data.Poster,
                    });
                })
            );

            return res.status(200).json(fastAndFurious);
        } catch (err) {
            if (err instanceof AxiosError)
                return next(new BadRequestException(err.response?.data?.Error));
            return next(err);
        }
    }

    public async getPiratesOfTheCaribbeanFilms(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const piratesOfTheCaribbean = new Array();
            const starWars = new Array();

            // get details for each star wars movies
            await Promise.all(
                star_wars.map(async (movie) => {
                    const response = await OMDB.getMovieById(
                        movie.imdbID,
                        req.omdb_api_key
                    );
                    if (response.data.Response === "False") return;
                    starWars.push(response.data);
                })
            );

            // get details for each pirates of the caribbean movies
            await Promise.all(
                pirates_of_the_caribbean.map(async (movie) => {
                    // get movie details by id
                    const response = await OMDB.getMovieById(
                        movie.imdbID,
                        req.omdb_api_key
                    );

                    // return if there is an error in the api call
                    if (response.data.Response === "False") return;

                    // check if the movie was producted before 2015
                    const is_produced_before_2015 =
                        Number(response.data.Year) < 2015;

                    // check if Paul Walker is in the movie
                    const is_paul_walker =
                        response.data.Actors.includes("Paul Walker");

                    // get the common actors with star wars
                    const actors = response.data.Actors.split(", ");
                    const star_wars_common_actors = starWars
                        .map((movie) => {
                            const values = actors.filter((word: string) =>
                                movie.Actors.includes(word)
                            );
                            return values;
                        })
                        // create 1d array
                        .flat()
                        // return only valid elements
                        .filter((element) => element)
                        // get uniques values
                        .filter((v, i, arr) => arr.indexOf(v) === i);

                    piratesOfTheCaribbean.push({
                        title: response.data.Title,
                        year: response.data.Year,
                        director: response.data.Director,
                        poster: response.data.Poster,
                        is_produced_before_2015,
                        is_paul_walker,
                        star_wars_common_actors:
                            star_wars_common_actors.join(", "),
                    });
                })
            );

            // check that the sheet exists and create it if not
            await SpreadSheet.checkAndCreateSheet("Pirates des caraïbes", [
                "poster",
                "title",
                "year",
                "director",
                "is_produced_before_2015",
                "is_paul_walker",
                "star_wars_common_actors",
            ]);

            // clear the sheet
            await SpreadSheet.clearRows();

            // add values in the spreadsheet
            for (let i = 0; i < piratesOfTheCaribbean.length; i++)
                await SpreadSheet.addRow(piratesOfTheCaribbean[i]);

            return res.status(200).json(piratesOfTheCaribbean);
        } catch (err) {
            if (err instanceof AxiosError)
                return next(new BadRequestException(err.response?.data?.Error));
            return next(err);
        }
    }
}

export default new FilmController();
