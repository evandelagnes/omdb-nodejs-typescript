import { BadRequestException } from "@exceptions";
import { env } from "@providers";
import axios from "axios";

class OMDB {
    public async getAllMoviesFromSearch(
        search: string,
        omdb_api_key: string | undefined
    ) {
        if (omdb_api_key === undefined)
            throw new BadRequestException("Provide OMDB Api Key.");

        const movies = new Array();
        const query = (name: string) =>
            new URLSearchParams({
                apikey: omdb_api_key,
                s: name,
                type: "movie",
            });

        // make the first movies search
        const response = await axios.get(
            `http://www.omdbapi.com/?${query(search)}`
        );

        // return an empty array in case of error
        if (response.data.Response === "False") return movies;

        movies.push(response.data.Search.flat());

        // returns if there are enough results
        if (response.data.totalResults <= 10) return movies;

        // otherwise do the other queries according to the number of results
        await Promise.all(
            [...Array(Math.floor(response.data.totalResults / 10) + 1).keys()]
                .slice(1)
                .map(async (i) => {
                    const response = await axios.get(
                        `http://www.omdbapi.com/?${query(search)}&page=${i + 1}`
                    );
                    if (response.data.Response == "False") return;
                    movies.push(response.data.Search.flat());
                })
        );
        return movies.flat();
    }

    public async getMovieById(id: string, omdb_api_key: string | undefined) {
        if (omdb_api_key === undefined)
            throw new BadRequestException("Provide OMDB Api Key.");

        const query = (name: string) =>
            new URLSearchParams({
                apikey: omdb_api_key,
                i: name,
                type: "movie",
            });

        // make get movie id call
        return await axios.get(`http://www.omdbapi.com/?${query(id)}`);
    }
}

export default new OMDB();
