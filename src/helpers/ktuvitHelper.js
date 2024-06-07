import chardet from "chardet";
import iconv from "iconv-lite";
import imdb2name from "name-to-imdb";
import transliteration from "transliteration";

import ktuvitApi from "../apis/ktuvitApi.js";
import extractHtmlContent from "../utils/extractHtmlContent.js";
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
        name: transliteration.transliterate(imdbData.name),
        year: imdbData.year,
        type: isMovie ? "0" : "1",
    };
    if (imdbData === undefined) throw new Error(`Ktuvit Imdb data not found for imdbID=${imdbID}`);

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


const extractSubtitlesFromHTML = (html, isMovie) => {
    const tableRowsRegex = new RegExp("<tr>([\\s\\S]*?)<\\/tr>", "gi");
    const idRegex = /data-subtitle-id="([^"]+)"/;
    const nameRegex = /<div style="float: right; width: 95%;">\s*([\s\S]*?)<br \/>/;

    const tableRows = extractHtmlContent.many(html, tableRowsRegex);
    const filteredTableRows = isMovie ? tableRows.slice(1) : tableRows;
    const extractedSubtitles = filteredTableRows.map((row) => {
        const subtitleID = extractHtmlContent.single(row, idRegex)?.[1];
        const subtitleName = extractHtmlContent.single(row, nameRegex)?.[1].trim();

        return { id: subtitleID, name: subtitleName };
    });

    return extractedSubtitles;
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