import imdb2name from "name-to-imdb";
import jsdom from "jsdom";
import chardet from "chardet";
import iconv from "iconv-lite";

import ktuvitApi from "../apis/ktuvitApi.js";
import request from "../utils/request.js";


const safeGetRequest = async (url, tries = 2) => {
    let response;

    while (tries--) {
        response = await request.get(url, ktuvitHeaders);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`Ktuvit safeGetRequest - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

const safeGetBufferRequest = async (url, tries = 2) => {
    let response;

    while (tries--) {
        response = await request.getBuffer(url, ktuvitHeaders);

        if (response.statusCode === 200) break;
    }

    if (response.statusCode !== 200) throw new Error(`Ktuvit safeGetBufferRequest - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

const safePostRequest = async (url, body, tries = 2) => {
    let response;

    while (tries--) {
        response = await request.post(url, ktuvitHeaders, body);

        if (response.statusCode === 200) break;

    }

    if (response.statusCode !== 200) throw new Error(`Ktuvit safePostRequest - Code=${response.statusCode}, Message=${response.body}`);
    return response;
};

let cookie = null;
const getCookie = async () => {
    if (cookie) return cookie;

    const url = ktuvitApi.LOGIN_URL;
    const response = await request.post(url, { "Content-Type": "application/json" }, { request: { Email: process.env.KTUVIT_USERNAME, Password: process.env.KTUVIT_PASSWORD } });

    [cookie] = response.headers["set-cookie"][1].split(";");
    return cookie;
};
const ktuvitHeaders = { "Content-Type": "application/json", accept: "application/json, text/javascript, */*; q=0.01", cookie: await getCookie() };


const getKtuvitID = async (imdbID, isMovie) => {
    let imdbData = await getImdbData(imdbID);
    if (imdbData === undefined) throw new Error(`Ktuvit Imdb data not found for imdbID=${imdbID}`);

    imdbData = {
        name: imdbData.name,
        type: isMovie ? "0" : "1",
        year: imdbData.year,
    };

    const ktuvitID = await searchKtuvit(imdbData);
    if (ktuvitID === undefined) throw new Error(`Ktuvit ID not found for imdbID=${imdbID}`);
    return ktuvitID;
};

const getImdbData = async (imdbID) => new Promise((resolve) => { imdb2name(imdbID, (error, res, data) => { resolve(data?.meta); }); });

const searchKtuvit = async (imdbData) => {
    const query = {
        request: {
            Actors: [],
            Countries: [],
            Directors: [],
            FilmName: imdbData.name,
            Genres: [],
            Languages: [],
            Page: 1,
            Rating: [],
            SearchType: imdbData.type,
            Studios: null,
            WithSubsOnly: false,
            Year: imdbData.year,
        },
    };

    const url = ktuvitApi.SEARCH_URL;
    const response = await request.post(url, ktuvitHeaders, query);
    const responseData = await response.body.json();

    const ktuvitResults = JSON.parse(responseData.d).Films;
    const ktuvitID = ktuvitResults[0]?.ID;

    return ktuvitID;
};

const extractSubtitlesFromHTML = (html) => {
    html = html.includes("<!DOCTYPE html>") ? html : `<!DOCTYPE html><table id="subtitlesList"><thead><tr/></thead>${html}</table>`;

    const dom = new jsdom.JSDOM(html);
    const { document } = dom.window;

    const subtitlesListElement = document.getElementById("subtitlesList");
    const rows = Array.from(subtitlesListElement.rows).slice(1);

    return rows?.map(row => {
        const id = row.cells[5].firstElementChild.getAttribute("data-subtitle-id");
        const name = row.cells[0].querySelector("div").innerHTML.split("<br>")[0].trim();
        const fileType = row.cells[1].innerHTML.trim();

        return { id, name, fileType };
    });
};

const decodeSubtitle = async (subtitleBuffer) => {
    const bufferArray = Buffer.from(subtitleBuffer);
    const detectedEncoding = chardet.detect(bufferArray);
    const decodeSubtitleContent = iconv.decode(bufferArray, detectedEncoding);

    return decodeSubtitleContent;
};
const ktuvitHelper = {
    safeGetRequest,
    safeGetBufferRequest,
    safePostRequest,

    getCookie,
    getKtuvitID,
    extractSubtitlesFromHTML,
    decodeSubtitle,
};


export default ktuvitHelper;