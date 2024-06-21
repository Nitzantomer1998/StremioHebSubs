import mtService from "../services/mtService.js";


const getSubtitlesList = async (imdbID, season, episode) => {
    const mtSubtitles = await mtService.fetchSubtitles(imdbID, season, episode);
    const stremioSubtitles = mtService.mapSubtitlesToStremio(mtSubtitles);

    return stremioSubtitles;
};

const getSubtitleContent = async (subtitleID) => {
    const subtitleContent = await mtService.extractSubtitle(subtitleID);

    return subtitleContent;
};

const mtController = {
    getSubtitlesList,
    getSubtitleContent,
};


export default mtController;