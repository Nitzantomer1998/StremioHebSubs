import osApi from "../apis/osApi.js";
import baseConfig from "../configs/baseConfig.js";
import request from "../utils/request.js";


const fetchSubtitlesFromOS = async (imdbID, season, episode) => {
    const url = `${osApi.CONTENT_URL}/subtitles?imdb_id=${imdbID}${season ? `&season_number=${season}&episode_number=${episode}` : ""}&languages=he`;
    const response = await request.getTemp(url);
    const osSubtitles = response.body.data;

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

    const linkResponse = await request.postTemp(url, { file_id: subtitleID });
    const srtLink = linkResponse.body.link;

    const srtResponse = await request.get(srtLink);
    const srtContent = await srtResponse.body.text();

    return srtContent;
};


const osService = {
    fetchSubtitlesFromOS,
    mapSubtitlesToStremio,
    extractSubtitleFromOS,
};


export default osService;