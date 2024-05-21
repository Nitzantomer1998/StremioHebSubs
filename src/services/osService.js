import osApi from "../apis/osApi.js";
import baseConfig from "../configs/baseConfig.js";
import osConfig from "../configs/osConfig.js";
import request from "../utils/request.js";


const fetchSubtitlesFromOS = async (imdbID, season, episode) => {
    const url = `${osApi.CONTENT_URL}/subtitles?imdb_id=${imdbID}${season ? `&season_number=${season}&episode_number=${episode}` : ""}&languages=he`;
    const response = await request.get(url, osConfig.getHeaders());
    const responseBody = await response.body.json();
    const osSubtitles = responseBody.data;

    osSubtitles.forEach((s) => {
        s.id = s.attributes.files[0].file_id;
        s.name = s.attributes.release;

        s.imdbID = imdbID;
        s.season = season;
        s.episode = episode;
    });

    return osSubtitles;
};

const mapSubtitlesToStremio = (subtitles) => {
    return subtitles.map((s) => ({
        url: `${baseConfig.BASE_URL}/subtitles/OS/${s.imdbID}/${s.season}/${s.episode}/${s.id}.srt`,
        id: s.name,
        lang: "heb",
    }));
};

const extractSubtitleFromOS = async (subtitleID) => {
    const url = osApi.DOWNLOAD_URL;

    const linkResponse = await safePost(url, { file_id: subtitleID });
    const responseBody = await linkResponse.body.json();
    const srtLink = responseBody.link;

    const srtResponse = await request.get(srtLink, osConfig.getHeaders());
    const srtContent = await srtResponse.body.text();

    return srtContent;
};

const safePost = async (url, body, tries = 2) => {
    let response;

    while (tries) {
        const headers = osConfig.postHeaders();
        response = await request.post(url, headers, body);

        if (response.statusCode === 200) break;
        else osConfig.updateApiKey();

        tries--;
    }

    if (response.statusCode === 406) throw new Error("OpenSubtitles API Keys Are Maxed Out");
    return response;
};

const osService = {
    fetchSubtitlesFromOS,
    mapSubtitlesToStremio,
    extractSubtitleFromOS,
};


export default osService;