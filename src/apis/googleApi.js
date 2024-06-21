import dotenv from "dotenv";
dotenv.config();


const googleApi = {
    TRANSLATE_URL: process.env.GOOGLE_TRANSLATE_URL,
};


export default googleApi;