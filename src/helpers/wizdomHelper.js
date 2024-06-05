import request from "../utils/request.js";


const safeGetRequest = async (url, tries = 2) => {
    let response;

    while (tries--) {
        response = await request.get(url);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`Wizdom safeGetRequest - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

const safeGetBufferRequest = async (url, tries = 2) => {
    let response;

    while (tries--) {
        response = await request.getBuffer(url);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`Wizdom safeGetBufferRequest - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

const wizdomHelper = {
    safeGetRequest,
    safeGetBufferRequest,
};


export default wizdomHelper;