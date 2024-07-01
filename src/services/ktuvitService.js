import ktuvitApi from "../apis/ktuvitApi.js";
import baseConfig from "../configs/baseConfig.js";
import ktuvitConfig from "../configs/ktuvitConfig.js";
import ktuvitHelper from "../helpers/ktuvitHelper.js";
import httpService from "./httpService.js";
import subtitleService from "./subtitleService.js";


const fetchSubtitles = async (imdbID, season, episode) => {
    const ktuvitID = await ktuvitHelper.getKtuvitID(imdbID, season === "0");

    const url = season === "0" ? `${ktuvitApi.MOVIES_URL}ID=${ktuvitID}` : `${ktuvitApi.SERIES_URL}SeriesID=${ktuvitID}&Season=${season}&Episode=${episode}`;
    const response = await httpService.safeGetRequest(url, ktuvitConfig.GET_HEADERS(), "Ktuvit");
    const responseHTML = await response.body.text();

    const ktuvitSubtitles = ktuvitHelper.extractSubtitlesFromHTML(responseHTML, season === "0");
    ktuvitSubtitles.forEach((s) => {
        s.id = `${ktuvitID}-${s.id}`;

        s.imdbID = imdbID;
        s.season = season;
        s.episode = episode;
    });

    return ktuvitSubtitles;
};

const mapSubtitlesToStremio = (subtitles) => {
    const stremioSubtitles = subtitles.map((s) => ({
        id: s.name,
        provider: "Ktuvit",
        score: 0,
        lang: "heb",
        url: `${baseConfig.BASE_URL}/subtitles/Ktuvit/${s.imdbID}/${s.season}/${s.episode}/${s.id}`,
    }));

    return stremioSubtitles;
};

const extractSubtitle = async (subtitleID, tries = 3) => {
    const [ktuvitID, subID] = subtitleID.split("-");

    let subtitleBuffer;
    while (tries--) {
        const identifierUrl = ktuvitApi.DOWNLOAD_IDENTIFIER_URL;
        const identifierResponse = await httpService.safePostRequest(identifierUrl, ktuvitConfig.GET_HEADERS(), { request: { FilmID: ktuvitID, SubtitleID: subID, FontColor: "", FontSize: 0, PredefinedLayout: -1 } }, "Ktuvit");
        const identifierResponseData = await identifierResponse.body.json();
        const identifier = JSON.parse(identifierResponseData.d).DownloadIdentifier;

        const downloadUrl = `${ktuvitApi.DOWNLOAD_URL}DownloadIdentifier=${identifier}`;
        const downloadResponse = await httpService.safeGetBufferRequest(downloadUrl, ktuvitConfig.GET_HEADERS(), "Ktuvit");
        subtitleBuffer = await downloadResponse.body.arrayBuffer();

        if (subtitleBuffer.byteLength !== 83) break;
        await new Promise((resolve) => setTimeout(resolve, 300));
    }

    if (subtitleBuffer.byteLength === 83) throw new Error(`Failed To Download Ktuvit Subtitle ${subtitleID}`);
    return await subtitleService.subtitlePipeline(subtitleBuffer);
};

const ktuvitService = {
    fetchSubtitles,
    mapSubtitlesToStremio,
    extractSubtitle,
};


export default ktuvitService;