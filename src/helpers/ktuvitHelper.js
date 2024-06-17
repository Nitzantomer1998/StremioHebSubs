import transliteration from "transliteration";

import ktuvitApi from "../apis/ktuvitApi.js";
import tmdbApi from "../apis/tmdbApi.js";
import ktuvitConfig from "../configs/ktuvitConfig.js";
import tmdbConfig from "../configs/tmdbConfig.js";
import httpService from "../services/httpService.js";
import extractHtmlContent from "../utils/extractHtmlContent.js";


const getKtuvitID = async (imdbID, isMovie) => {
    const tmdbUrl = `${tmdbApi.SEARCH_URL}/${imdbID}?api_key=${tmdbConfig.API_KEY}&external_source=imdb_id`;
    const tmdbResponse = await httpService.safeGethttpService(tmdbUrl, {}, "Ktuvit");
    const responseData = await tmdbResponse.body.json();
    const ktuvitID = await searchKtuvit(responseData, imdbID, isMovie);

    return ktuvitID;
};

const searchKtuvit = async (data, imdbID, isMovie) => {
    const query = {
        httpService: {
            Actors: [],
            Countries: [],
            Directors: [],
            FilmName: transliteration.transliterate(isMovie ? data.movie_results[0]?.title : data.tv_results[0]?.name),
            Genres: [],
            Languages: [],
            Page: 1,
            Rating: [],
            SearchType: isMovie ? "0" : "1",
            Studios: null,
            WithSubsOnly: isMovie,
            Year: "",
        },
    };

    const url = ktuvitApi.SEARCH_URL;
    const response = await httpService.safePosthttpService(url, ktuvitConfig.GET_HEADERS(), query, "Ktuvit");
    const responseData = await response.body.json();

    const ktuvitResults = JSON.parse(responseData.d).Films;
    const ktuvitID = ktuvitResults.find((result) => result.IMDB_Link.match(/tt\d+/)[0] === imdbID)?.ID;

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
        const subtitleName = extractHtmlContent.single(row, nameRegex)?.[1]?.trim();

        return { id: subtitleID, name: subtitleName };
    }).filter((s) => s.id && s.name);

    return extractedSubtitles;
};


const ktuvitHelper = {
    getKtuvitID,
    extractSubtitlesFromHTML,
};


export default ktuvitHelper;