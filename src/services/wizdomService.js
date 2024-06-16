import AdmZip from "adm-zip";

import wizdomApi from "../apis/wizdomApi.js";
import baseConfig from "../configs/baseConfig.js";
import httpService from "./httpService.js";
import subtitleService from "./subtitleService.js";
import decodeSubtitle from "../utils/decodeSubtitle.js";


const fetchSubtitles = async (imdbID, season, episode) => {
    const url = `${wizdomApi.CONTENT_URL}/search?action=by_id&imdb=${imdbID}&season=${season}&episode=${episode}`;
    const response = await httpService.safeGethttpService(url, {}, "Wizdom");

    const wizdomSubtitles = await response.body.json();
    wizdomSubtitles.forEach((s) => {
        s.name = s.versioname;

        s.imdbID = imdbID;
        s.season = season;
        s.episode = episode;
    });

    return wizdomSubtitles;
};

const mapSubtitlesToStremio = (subtitles) => {
    const stremioSubtitles = subtitles.map((s) => ({
        id: s.name,
        provider: "Wizdom",
        score: 0,
        lang: "heb",
        url: `${baseConfig.BASE_URL}/subtitles/Wizdom/${s.imdbID}/${s.season}/${s.episode}/${s.id}`,
    }));

    return stremioSubtitles;
};

const extractSubtitle = async (subtitleID) => {
    const url = `${wizdomApi.DOWNLOAD_URL}/${subtitleID}`;
    const response = await httpService.safeGetBufferhttpService(url, {}, "Wizdom");
    const data = await response.body.arrayBuffer();

    const zip = new AdmZip(Buffer.from(data));
    const zipEntries = zip.getEntries();
    const fileEntry = zipEntries[zipEntries.length - 1];
    const content = fileEntry.getData().toString();

    const decodedContent = await decodeSubtitle(content);
    const convertedContent = subtitleService(decodedContent);

    return convertedContent;
};

const wizdomService = {
    fetchSubtitles,
    mapSubtitlesToStremio,
    extractSubtitle,
};


export default wizdomService;