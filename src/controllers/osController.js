import osService from "../services/osService.js";


const getSubtitlesList = async (imdbID, season, episode) => {
    const osSubtitles = await osService.fetchSubtitles(imdbID, season, episode);
    const stremioSubtitles = osService.mapSubtitlesToStremio(osSubtitles);

    return stremioSubtitles;
};

const getSubtitleContent = async (subtitleID) => {
    const subtitleContent = await osService.extractSubtitle(subtitleID);

    return subtitleContent;
};

const osController = {
    getSubtitlesList,
    getSubtitleContent,
};


export default osController;