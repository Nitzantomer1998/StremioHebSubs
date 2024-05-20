import manifestConfig from "../configs/manifestConfig.js";
import dbService from "../services/dbService.js";
import loggerService from "../services/loggerService.js";
import stremioService from "../services/stremioService.js";
import extractData from "../utils/dataExtractor.js";


const getConfigPage = (req, res) => res.sendFile("index.html", { root: "./public" });
const getStaticFile = (req, res) => res.sendFile(req.params.path, { root: "./public" });

const getManifest = async (req, res) => {
  loggerService.logInstall();
  // dbService.insertAddonInstall();

  res.send(manifestConfig);
};

const getSubtitleSrt = async (req, res) => {
  const { provider, imdbID, season, episode, subtitleID } = req.params;

  loggerService.logDownload(provider, subtitleID);
  // dbService.insertDownloadedContent(provider, imdbID, season, episode);

  const srtContent = await stremioService.getSubtitleSrt(provider, subtitleID);

  res.send(srtContent);
};

const getSubtitlesList = async (req, res) => {
  const { userConfig, imdbID, season, episode, filename } = extractData(req.params);

  loggerService.logWatch(imdbID, season, episode);
  // dbService.insertWatchedContent(imdbID, season, episode);

  const stremioSubtitles = await stremioService.getSubtitlesList(userConfig, imdbID, season, episode);
  const sortedSubtitles = stremioService.sortSubtitlesByFilename(stremioSubtitles, filename);

  res.send({ subtitles: sortedSubtitles });
};

const stremioController = {
  getConfigPage,
  getStaticFile,
  getManifest,
  getSubtitleSrt,
  getSubtitlesList,
};


export default stremioController;