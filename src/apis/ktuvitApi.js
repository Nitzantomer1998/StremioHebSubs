import dotenv from "dotenv";
dotenv.config();


const ktuvitApi = {
    LOGIN_URL: process.env.KTUVIT_LOGIN_URL,

    SEARCH_URL: process.env.KTUVIT_SEARCH_URL,
    SERIES_URL: process.env.KTUVIT_SERIES_URL,
    MOVIES_URL: process.env.KTUVIT_MOVIES_URL,

    DOWNLOAD_URL: process.env.KTUVIT_DOWNLOAD_URL,
    DOWNLOAD_IDENTIFIER_URL: process.env.KTUVIT_DOWNLOAD_IDENTIFIER_URL,
};


export default ktuvitApi;