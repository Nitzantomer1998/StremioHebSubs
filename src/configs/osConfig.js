import dotenv from "dotenv";
dotenv.config();


let apiKeyIndex = 0;
const apiKeys = process.env.OS_API_KEY.split(",");

const getApiKeysLength = () => apiKeys.length;
const getApiKey = () => apiKeys[apiKeyIndex];
const updateApiKey = () => { apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length; };

const getHeaders = () => ({
    "Content-Type": "application/json",
    "Api-Key": getApiKey(),
    "User-Agent": "StremioHebSub v1.0.0",
});

const postHeaders = () => ({
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Api-Key": getApiKey(),
    "User-Agent": "StremioHebSub v1.0.0",
});

const osConfig = {
    getApiKeysLength,
    updateApiKey,
    getHeaders,
    postHeaders,
};


export default osConfig;