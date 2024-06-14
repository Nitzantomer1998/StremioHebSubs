import osApi from "../apis/osApi.js";
import baseConfig from "../configs/baseConfig.js";
import osConfig from "../configs/osConfig.js";
import request from "../utils/request.js";


const fetchSubtitles = async (imdbID, season, episode) => {
    const url = `${osApi.CONTENT_URL}/subtitles?imdb_id=${imdbID}${season === "0" ? "" : `&season_number=${season}&episode_number=${episode}`}&languages=he`;
    const response = await request.safeGetRequest(url, osConfig.GET_HEADERS, "OS");
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
        provider: "OpenSubtitles",
        score: 0,
        lang: "heb",
        url: `${baseConfig.BASE_URL}/subtitles/OS/${s.imdbID}/${s.season}/${s.episode}/${s.id}`,
    }));

    return stremioSubtitles;
};

const extractSubtitle = async (subtitleID) => {
    const url = osApi.DOWNLOAD_URL;
    const linkResponse = await request.safePostRequest(url, osConfig.POST_HEADERS(), { file_id: subtitleID }, "OS");
    const responseBody = await linkResponse.body.json();
    const subtitleLink = responseBody.link;

    const subtitleResponse = await request.safeGetRequest(subtitleLink, osConfig.GET_HEADERS, "OS");
    const subtitleContent = await subtitleResponse.body.text();

    return subtitleContent;
};

const osService = {
    fetchSubtitles,
    mapSubtitlesToStremio,
    extractSubtitle,
};


export default osService;