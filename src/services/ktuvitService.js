import ktuvitApi from "../apis/ktuvitApi.js";
import baseConfig from "../configs/baseConfig.js";
import ktuvitHelper from "../helpers/ktuvitHelper.js";


const fetchSubtitles = async (imdbID, season, episode) => {
    const ktuvitID = await ktuvitHelper.getKtuvitID(imdbID, season === "0");
    const url = season === "0" ? `${ktuvitApi.MOVIES_URL}ID=${ktuvitID}` : `${ktuvitApi.SERIES_URL}SeriesID=${ktuvitID}&Season=${season}&Episode=${episode}`;

    const response = await ktuvitHelper.safeGetRequest(url);
    const responseHTML = await response.body.text();

    const ktuvitSubtitles = ktuvitHelper.extractSubtitlesFromHTML(responseHTML);
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

const extractSubtitle = async (subtitleID) => {
    const [ktuvitID, subID] = subtitleID.split("-");

    const identifierUrl = ktuvitApi.DOWNLOAD_IDENTIFIER_URL;
    const identifierResponse = await ktuvitHelper.safePostRequest(identifierUrl, { request: { FilmID: ktuvitID, SubtitleID: subID, FontColor: "", FontSize: 0, PredefinedLayout: -1 } });
    const identifierResponseData = await identifierResponse.body.json();
    const identifier = JSON.parse(identifierResponseData.d).DownloadIdentifier;

    const downloadUrl = `${ktuvitApi.DOWNLOAD_URL}DownloadIdentifier=${identifier}`;
    const downloadResponse = await ktuvitHelper.safeGetBufferRequest(downloadUrl);
    const subtitleBuffer = await downloadResponse.body.arrayBuffer();
    const subtitleContent = await ktuvitHelper.decodeSubtitle(subtitleBuffer);

    return subtitleContent;
};

const ktuvitService = {
    fetchSubtitles,
    mapSubtitlesToStremio,
    extractSubtitle,
};


export default ktuvitService;