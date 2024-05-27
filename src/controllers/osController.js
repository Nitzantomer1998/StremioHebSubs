import osService from "../services/osService.js";


const getSubtitlesList = async (imdbID, season, episode) => {
    const osSubtitles = await osService.fetchSubtitlesFromOS(imdbID, season, episode);
    const stremioSubtitles = osService.mapSubtitlesToStremio(osSubtitles);

    return stremioSubtitles;
};

const getSubtitleContent = async (subtitleID) => {
    const subtitleContent = await osService.extractSubtitleFromOS(subtitleID);

    return subtitleContent;
};

const osController = {
    getSubtitlesList,
    getSubtitleContent,
};


export default osController;