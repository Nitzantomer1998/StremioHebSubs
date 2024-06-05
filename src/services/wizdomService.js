import AdmZip from "adm-zip";

import wizdomApi from "../apis/wizdomApi.js";
import baseConfig from "../configs/baseConfig.js";
import wizdomHelper from "../helpers/wizdomHelper.js";
import request from "../utils/request.js";


const fetchSubtitles = async (imdbID, season, episode) => {
    const url = `${wizdomApi.CONTENT_URL}/search?action=by_id&imdb=${imdbID}&season=${season}&episode=${episode}`;
    const response = await wizdomHelper.safeFetchSubtitles(url);

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
    const response = await request.getBuffer(url);
    const data = await response.body.arrayBuffer();

    const zip = new AdmZip(Buffer.from(data));
    const zipEntries = zip.getEntries();
    const fileEntry = zipEntries.find(entry => [".srt", ".str"].some(extention => entry.entryName.endsWith(extention)));

    if (fileEntry === undefined) throw new Error("Subtitle File Extension Not Supported");
    return fileEntry.getData().toString("utf8");
};

const wizdomService = {
    fetchSubtitles,
    mapSubtitlesToStremio,
    extractSubtitle,
};


export default wizdomService;