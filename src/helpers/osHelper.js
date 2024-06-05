import osConfig from "../configs/osConfig.js";
import request from "../utils/request.js";


const safeGetRequest = async (url, tries = 2) => {
    let response;

    while (tries--) {
        response = await request.get(url, osConfig.getHeaders());

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`OS safeGetRequest - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

const safePostRequest = async (url, body, tries = osConfig.getApiKeysLength()) => {
    let response;

    while (tries--) {
        response = await request.post(url, osConfig.postHeaders(), body);

        if (response.statusCode === 200) break;
        else osConfig.updateApiKey();
    }

    if (response.statusCode === 406) throw new Error("OS API Keys Are Maxed Out");
    if (response.statusCode !== 200) throw new Error(`OS safePostRequest - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

const osHelper = {
    safeGetRequest,
    safePostRequest,
};


export default osHelper;