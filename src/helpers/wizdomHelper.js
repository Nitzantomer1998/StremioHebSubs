import request from "../utils/request.js";


const safeFetchSubtitles = async (url, tries = 2) => {
    let response;

    while (tries) {
        response = await request.get(url);

        if (response.statusCode === 200) break;

        tries--;
    }

    if (response.statusCode !== 200) throw new Error(`Wizdom SafeFetchSubtitles - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

const wizdomHelper = {
    safeFetchSubtitles,
};


export default wizdomHelper;