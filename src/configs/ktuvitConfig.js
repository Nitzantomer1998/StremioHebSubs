import dotenv from "dotenv";
dotenv.config();


let cookieSession;
const ktuvitConfig = {
    USERNAME: process.env.KTUVIT_USERNAME,
    PASSWORD: process.env.KTUVIT_PASSWORD,

    COOKIE: cookieSession,
    COOKIE_REFRESH_INTERVAL: parseInt(process.env.KTUVIT_COOKIE_REFRESH_INTERVAL),

    GET_HEADERS: () => ({ "Content-Type": "application/json", accept: "application/json, text/javascript, */*; q=0.01", cookie: cookieSession }),
    UPDATE_COOKIE: (newCookieSession) => { cookieSession = newCookieSession; },
};


export default ktuvitConfig;