import undici from "undici";


const get = async (url, headers = {}) => await undici.request(url, { headers, maxRedirections: 10 });
const getBuffer = async (url, headers = {}) => await undici.request(url, { headers, maxRedirections: 10 });
const post = async (url, headers = {}, body = {}) => await undici.request(url, { method: "POST", headers, body: Buffer.from(JSON.stringify(body)), maxRedirections: 10 });


const request = {
    get,
    getBuffer,
    post,
}


export default request;