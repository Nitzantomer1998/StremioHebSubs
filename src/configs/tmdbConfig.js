import dotenv from "dotenv";
dotenv.config();


const tmdbConfig = {
    API_KEY: process.env.TMDB_API_KEY
};


export default tmdbConfig;