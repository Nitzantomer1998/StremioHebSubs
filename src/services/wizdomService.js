import AdmZip from "adm-zip";

import wizdomApi from "../apis/wizdomApi.js";
import baseConfig from "../configs/baseConfig.js";
import request from "../utils/request.js";


const fetchSubtitlesFromWizdom = async (imdbID, season, episode) => {
    const url = `${wizdomApi.CONTENT_URL}/search?action=by_id&imdb=${imdbID}&season=${season}&episode=${episode}`;
    const response = await request.get(url);

    const wizdomSubtitles = response.body;

    wizdomSubtitles.forEach((s) => {
        s.name = s.versioname;

        s.imdbID = imdbID;
        s.season = season;
        s.episode = episode;
    });

    return wizdomSubtitles;
};

const mapSubtitlesToStremio = (subtitles) => {
    return subtitles.map((s) => ({
        url: `${baseConfig.BASE_URL}/subtitles/Wizdom/${s.imdbID}/${s.season}/${s.episode}/${s.id}.srt`,
        id: s.name,
        lang: "heb",
    }));
};

const extractSubtitleFromWizdom = async (subtitleID) => {
    const url = `${wizdomApi.DOWNLOAD_URL}/${subtitleID}`;
    const response = await request.getBuffer(url);

    const zip = new AdmZip(response.body);
    const zipEntries = zip.getEntries();
    const srtEntry = zipEntries.find(entry => entry.entryName.endsWith('.srt'));
    const srtContent = srtEntry.getData().toString('utf8');

    return srtContent;
};

const wizdomService = {
    fetchSubtitlesFromWizdom,
    mapSubtitlesToStremio,
    extractSubtitleFromWizdom,
};


export default wizdomService;