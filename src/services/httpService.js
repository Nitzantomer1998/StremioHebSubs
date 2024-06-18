import undici from "undici";


const get = async (url, headers = {}) => await undici.request(url, { headers, maxRedirections: 10 });
const getBuffer = async (url, headers = {}) => await undici.request(url, { headers, maxRedirections: 10 });
const post = async (url, headers = {}, body = {}) => await undici.request(url, { method: "POST", headers, body: Buffer.from(JSON.stringify(body)), maxRedirections: 10 });

const safeGetRequest = async (url, headers, provider, tries = 2) => {
    let response;

    while (tries--) {
        response = await get(url, headers);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`${provider} safeGetRequest - Code=${response.statusCode}, Message=${(await response.body?.json())?.errors?.[0]}`);
    return response;
};

const safeGetBufferRequest = async (url, headers, provider, tries = 2) => {
    let response;

    while (tries--) {
        response = await getBuffer(url, headers);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`${provider} safeGetBufferRequest - Code=${response.statusCode}, Message=${(await response.body?.json())?.errors?.[0]}`);
    return response;
};

const safePostRequest = async (url, headers, body, provider, tries = 2) => {
    let response;

    while (tries--) {
        response = await post(url, headers, body);

        if (response.statusCode === 200) break;

    }

    if (response.statusCode !== 200) throw new Error(`${provider} safePostRequest - Code=${response.statusCode}, Message=${(await response.body?.json())?.errors?.[0]}`);
    return response;
};

const httpService = {
    safeGetRequest,
    safeGetBufferRequest,
    safePostRequest,
};


export default httpService;