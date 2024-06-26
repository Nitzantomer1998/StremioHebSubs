import ktuvitController from "../controllers/ktuvitController.js";
import mtController from "../controllers/mtController.js";
import osController from "../controllers/osController.js";
import wizdomController from "../controllers/wizdomController.js";
import stringSimilarity from "../utils/stringSimilarity.js";
import tryCatchWrapper from "../utils/tryCatchWrapper.js";


const getSubtitlesList = async (userConfig, imdbID, season, episode) => {
    const subtitles = [];

    const subtitlePromises = userConfig.map(provider => subtitleProviders[provider].getSubtitlesList(imdbID, season, episode));
    const subtitlesArray = await Promise.all(subtitlePromises);

    subtitlesArray.forEach(providerSubtitles => subtitles.push(...providerSubtitles));

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
        s.score = similarityScore;
    });
    subtitles.sort((a, b) => b.score - a.score);

    return subtitles;
};

const subtitleProviders = {
    Wizdom: wizdomController,
    OS: osController,
    Ktuvit: ktuvitController,
    MT: mtController,
};

Object.keys(subtitleProviders).forEach(provider => {
    subtitleProviders[provider].getSubtitlesList = tryCatchWrapper.local(subtitleProviders[provider].getSubtitlesList);
    subtitleProviders[provider].getSubtitleContent = tryCatchWrapper.local(subtitleProviders[provider].getSubtitleContent);
});

const stremioService = {
    getSubtitleContent,
    getSubtitlesList,
    sortSubtitlesByFilename,
};


export default stremioService;