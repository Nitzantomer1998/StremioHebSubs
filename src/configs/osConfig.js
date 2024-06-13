import dotenv from "dotenv";
dotenv.config();


let apiKeyIndex = 0;
const apiKeys = process.env.OS_API_KEY.split(",");


const osConfig = {
    GET_HEADERS: { "Content-Type": "application/json", "Api-Key": apiKeys[apiKeyIndex], "User-Agent": "StremioHebSub v1.0.0" },
    POST_HEADERS: () => ({ "Accept": "application/json", "Content-Type": "application/json", "Api-Key": apiKeys[(apiKeyIndex++) % apiKeys.length], "User-Agent": "StremioHebSub v1.0.0" }),
};


export default osConfig;