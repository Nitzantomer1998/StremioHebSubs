import manifestConfig from "../configs/manifestConfig.js";
import dbService from "../services/dbService.js";
import loggerService from "../services/loggerService.js";
import stremioService from "../services/stremioService.js";
import extractData from "../utils/extractData.js";


const getHomePage = (req, res) => res.sendFile("index.html", { root: "./public/pages" });
const getConfigPage = (req, res) => res.sendFile("config.html", { root: "./public/pages" });
const getStaticFile = (req, res) => res.sendFile(req.params.path, { root: `./public/${req.params.folder}` });

const getManifest = async (req, res) => {
    const { userConfig = "Default" } = req.params;

    loggerService.logInstall(userConfig);
    dbService.insertAddonInstall(userConfig);

    res.send(manifestConfig);
};

const getSubtitlesList = async (req, res) => {
    const { userConfig, imdbID, season, episode, filename } = extractData(req.params);

    loggerService.logWatch(imdbID, season, episode, filename);
    dbService.insertWatchedContent(imdbID, season, episode);

    const stremioSubtitles = await stremioService.getSubtitlesList(userConfig, imdbID, season, episode);
    const sortedSubtitles = stremioService.sortSubtitlesByFilename(stremioSubtitles, filename);

    res.send({ subtitles: sortedSubtitles });
};

const getSubtitleContent = async (req, res) => {
    const { provider, imdbID, season, episode, subtitleID } = req.params;

    loggerService.logDownload(provider, subtitleID);
    dbService.insertDownloadedContent(provider, imdbID, season, episode);

    const subtitleContent = await stremioService.getSubtitleContent(provider, subtitleID);

    res.send(subtitleContent);
};

const stremioController = {
    getHomePage,
    getConfigPage,
    getStaticFile,
    getManifest,
    getSubtitlesList,
    getSubtitleContent,
};


export default stremioController;