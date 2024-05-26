import dotenv from "dotenv";
dotenv.config();


const wizdomApi = {
    CONTENT_URL: process.env.WIZDOM_CONTENT_URL,
    DOWNLOAD_URL: process.env.WIZDOM_DOWNLOAD_URL,
};


export default wizdomApi;