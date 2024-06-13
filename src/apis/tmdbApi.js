import dotenv from "dotenv";
dotenv.config();


const tmdbApi = {
    SEARCH_URL: process.env.TMDB_SEARCH_URL,
};


export default tmdbApi;