import undici from "undici";


const get = async (url, headers = {}) => await undici.request(url, { headers, maxRedirections: 10 });
const getBuffer = async (url, headers = {}) => await undici.request(url, { headers, maxRedirections: 10 });
const post = async (url, headers = {}, body = {}) => await undici.request(url, { method: "POST", headers, body: Buffer.from(JSON.stringify(body)), maxRedirections: 10 });

const safeGethttpService = async (url, headers, provider, tries = 2) => {
    let response;

    while (tries--) {
        response = await get(url, headers);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`${provider} safeGethttpService - Code=${response.statusCode}, Message=${(await response.body.json()).errors[0]}`);
    return response;
};

const safeGetBufferhttpService = async (url, headers, provider, tries = 2) => {
    let response;

    while (tries--) {
        response = await getBuffer(url, headers);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`${provider} safeGetBufferhttpService - Code=${response.statusCode}, Message=${(await response.body.json()).errors[0]}`);
    return response;
};

const safePosthttpService = async (url, headers, body, provider, tries = 2) => {
    let response;

    while (tries--) {
        response = await post(url, headers, body);

        if (response.statusCode === 200) break;

    }

    if (response.statusCode !== 200) throw new Error(`${provider} safePosthttpService - Code=${response.statusCode}, Message=${(await response.body.json()).errors[0]}`);
    return response;
};

const httpService = {
    safeGethttpService,
    safeGetBufferhttpService,
    safePosthttpService,
};


export default httpService;