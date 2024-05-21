import undici from "undici";
import superagent from "superagent";
import osConfig from "../configs/osConfig.js";


const get = async (url, headers = {}) => await undici.request(url, { headers });
const getBuffer = async (url, headers = {}) => await undici.request(url, { headers });
const post = async (url, headers = {}, body = {}) => await undici.request(url, { headers, body: Buffer.from(JSON.stringify(body)) });


const getTemp = async (url) => await superagent.get(url).set(osConfig.getHeaders());
const postTemp = async (url, body, tries = 0) => {
    return await superagent.post(url).set(osConfig.postHeaders()).send(body).catch((error) => {
        if (tries > osConfig.getApiKeysLength() - 1) {
            throw new Error("OpenSubtitles API Keys Are Maxed Out");
        }
        if (error.message === "Not Acceptable") {
            osConfig.updateApiKey();
            return postTemp(url, body, tries + 1);
        }
    });
};

const request = {
    get,
    getBuffer,
    post,
    
    getTemp,
    postTemp
}


export default request;