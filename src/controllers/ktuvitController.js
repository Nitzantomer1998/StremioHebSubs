import ktuvitService from "../services/ktuvitService.js";


const getSubtitlesList = async (imdbID, season, episode) => {
    const ktuvitSubtitles = await ktuvitService.fetchSubtitles(imdbID, season, episode);
    const stremioSubtitles = ktuvitService.mapSubtitlesToStremio(ktuvitSubtitles);

    return stremioSubtitles;
};

const getSubtitleContent = async (subtitleID) => {
    const subtitleContent = await ktuvitService.extractSubtitle(subtitleID);

    return subtitleContent;
};

const ktuvitController = {
    getSubtitlesList,
    getSubtitleContent,
};


export default ktuvitController;