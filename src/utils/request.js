import undici from "undici";


const get = async (url, headers = {}) => await undici.request(url, { headers });
const getBuffer = async (url, headers = {}) => await undici.request(url, { headers });
const post = async (url, headers = {}, body = {}) => await undici.request(url, { headers, body: Buffer.from(JSON.stringify(body)) });

const request = {
    get,
    getBuffer,
    post,
}


export default request;