import osService from "../services/osService.js";


const getSubtitleSrt = async (subtitleID) => {
    const srtContent = await osService.extractSubtitleFromOS(subtitleID);

    return srtContent;
};

const getSubtitlesList = async (imdbID, season, episode) => {
    const osSubtitles = await osService.fetchSubtitlesFromOS(imdbID, season, episode);
    const stremioSubtitles = osService.mapSubtitlesToStremio(osSubtitles);

    return stremioSubtitles;
};


const osController = {
    getSubtitleSrt,
    getSubtitlesList,
};


export default osController;