import osApi from "../apis/osApi.js";
import baseConfig from "../configs/baseConfig.js";
import osConfig from "../configs/osConfig.js";
import httpService from "./httpService.js";
import subtitleService from "./subtitleService.js";


const fetchSubtitles = async (imdbID, season, episode) => {
    const url = `${osApi.CONTENT_URL}/subtitles?imdb_id=${imdbID}${season === "0" ? "" : `&season_number=${season}&episode_number=${episode}`}&languages=en`;
    const response = await httpService.safeGetRequest(url, osConfig.GET_HEADERS, "MT");
    const responseBody = await response.body.json();

    let osSubtitles = responseBody.data;
    osSubtitles.forEach((s) => {
        s.id = s.attributes.files[0]?.file_id;
        s.name = s.attributes.release;

        s.imdbID = imdbID;
        s.season = season;
        s.episode = episode;
    });
    osSubtitles = osSubtitles.filter((s) => s.id !== undefined);

    return osSubtitles;
};

const mapSubtitlesToStremio = (subtitles) => {
    const stremioSubtitles = subtitles.map((s) => ({
        id: s.name,
        provider: "Google Translate",
        score: 0,
        lang: "🔵 Hebrew (Translated)",
        url: `${baseConfig.BASE_URL}/subtitles/MT/${s.imdbID}/${s.season}/${s.episode}/${s.id}`,
    }));

    return stremioSubtitles;
};

const extractSubtitle = async (subtitleID) => {
    const url = osApi.DOWNLOAD_URL;
    const linkResponse = await httpService.safePostRequest(url, osConfig.POST_HEADERS(), { file_id: subtitleID, sub_format: "srt" }, "MT");
    const responseBody = await linkResponse.body.json();
    const subtitleLink = responseBody.link;

    const subtitleResponse = await httpService.safeGetRequest(subtitleLink, osConfig.GET_HEADERS, "MT");
    const extractedSubtitle = await subtitleResponse.body.text();
    const subtitleContent = await subtitleService.subtitlePipeline(extractedSubtitle, false);

    return subtitleContent;
};

const mtService = {
    fetchSubtitles,
    mapSubtitlesToStremio,
    extractSubtitle,
};


export default mtService;