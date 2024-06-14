import chardet from "chardet";
import iconv from "iconv-lite";
import transliteration from "transliteration";

import ktuvitApi from "../apis/ktuvitApi.js";
import tmdbApi from "../apis/tmdbApi.js";
import ktuvitConfig from "../configs/ktuvitConfig.js";
import tmdbConfig from "../configs/tmdbConfig.js";
import extractHtmlContent from "../utils/extractHtmlContent.js";
import request from "../utils/request.js";


const getKtuvitID = async (imdbID, isMovie) => {
    const tmdbUrl = `${tmdbApi.SEARCH_URL}/${imdbID}?api_key=${tmdbConfig.API_KEY}&external_source=imdb_id`;
    const tmdbResponse = await request.safeGetRequest(tmdbUrl, {}, "Ktuvit");
    const responseData = await tmdbResponse.body.json();

    const imdbData = {
        imdbID,
        name: transliteration.transliterate(isMovie ? responseData.movie_results[0].title : responseData.tv_results[0].name),
        type: isMovie ? "0" : "1",
    };

    const ktuvitID = await searchKtuvit(imdbData);

    return ktuvitID;
};

const searchKtuvit = async (imdbData) => {
    let page = 1;

    while (true) {
        const query = {
            request: {
                Actors: [],
                Countries: [],
                Directors: [],
                FilmName: imdbData.name,
                Genres: [],
                Languages: [],
                Page: page,
                Rating: [],
                SearchType: imdbData.type,
                Studios: null,
                WithSubsOnly: false,
                Year: "",
            },
        };

        const url = ktuvitApi.SEARCH_URL;
        const response = await request.safePostRequest(url, ktuvitConfig.GET_HEADERS(), query, "Ktuvit");
        const responseData = await response.body.json();

        const ktuvitResults = JSON.parse(responseData.d).Films;
        const ktuvitID = ktuvitResults.find((result) => extractIMDbID(result.IMDB_Link) === imdbData.imdbID)?.ID;

        if (ktuvitID) return ktuvitID;
        if (ktuvitResults.length < 20) break;

        page++;
    }

    throw new Error(`Ktuvit ID Doesn't Exist for Imdb=${imdbData.imdbID}`);
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

const extractIMDbID = (url) => {
    const match = url.match(/tt\d+/);

    return match ? match[0] : null;
};

const updateCookie = async () => {
    const url = ktuvitApi.LOGIN_URL;
    const response = await request.safePostRequest(url, { "Content-Type": "application/json" }, { request: { Email: ktuvitConfig.USERNAME, Password: ktuvitConfig.PASSWORD } }, "Ktuvit");

    ktuvitConfig.UPDATE_COOKIE(response.headers["set-cookie"]);
};

setInterval(updateCookie, ktuvitConfig.COOKIE_REFRESH_INTERVAL);
await updateCookie();

const ktuvitHelper = {
    getKtuvitID,
    extractSubtitlesFromHTML,
    decodeSubtitle,
};


export default ktuvitHelper;