import osController from "../controllers/osController.js";
import wizdomController from "../controllers/wizdomController.js";
import stringSimilarity from "../utils/stringSimilarity.js";


const getSubtitlesList = async (userConfig, imdbID, season, episode) => {
    const subtitles = [];

    const subtitlePromises = userConfig.map(provider => subtitleProviders[provider].getSubtitlesList(imdbID, season, episode));
    const subtitlesArray = await Promise.all(subtitlePromises);
    subtitlesArray.forEach(providerSubtitles => mergeSubtitles(subtitles, providerSubtitles));

    return subtitles;
};

const getSubtitleContent = async (provider, subtitleID) => {
    const subtitleContent = await subtitleProviders[provider].getSubtitleContent(subtitleID);

    return subtitleContent;
};

const sortSubtitlesByFilename = (subtitles, filename) => {
    subtitles.forEach(s => {
        const similarityScore = stringSimilarity(s.id, filename);

        s.id = `${similarityScore}% [${s.provider}] ${s.id}`;
        s.score = parseFloat(similarityScore);
    });

    subtitles.sort((a, b) => b.score - a.score);

    return subtitles;
};

const mergeSubtitles = (subtitles, providerSubtitles) => {
    subtitles.push(...providerSubtitles.filter(sub => !subtitles.some(s => s.id === sub.id)));
};

const subtitleProviders = {
    OS: osController,
    Wizdom: wizdomController,
};

const stremioService = {
    getSubtitleContent,
    getSubtitlesList,
    sortSubtitlesByFilename,
};


export default stremioService;