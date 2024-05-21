import dotenv from "dotenv";
dotenv.config();


const osApi = {
    CONTENT_URL: process.env.OS_CONTENT_URL,
    DOWNLOAD_URL: process.env.OS_DOWNLOAD_URL,
};


export default osApi;