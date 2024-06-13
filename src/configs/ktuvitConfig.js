import dotenv from "dotenv";
dotenv.config();


let cookie;
const ktuvitConfig = {
    USERNAME: process.env.KTUVIT_USERNAME,
    PASSWORD: process.env.KTUVIT_PASSWORD,

    COOKIE: cookie,
    COOKIE_REFRESH_INTERVAL: parseInt(process.env.KTUVIT_COOKIE_REFRESH_INTERVAL),

    GET_HEADERS: { "Content-Type": "application/json", accept: "application/json, text/javascript, */*; q=0.01", cookie: cookie },
};


export default ktuvitConfig;