import lodash from "lodash";
import stringSimilarity from "string-similarity";

import osController from "../controllers/osController.js";
import wizdomController from "../controllers/wizdomController.js";


const getSubtitleSrt = async (provider, subtitleID) => {
  const srtContent = await subtitleProviders[provider].getSubtitleSrt(subtitleID);

  return srtContent;
};

const getSubtitlesList = async (userConfig, imdbID, season, episode) => {
  let subtitles = [];

  const subtitlePromises = userConfig.map(provider => subtitleProviders[provider].getSubtitlesList(imdbID, season, episode));
  const subtitlesArray = await Promise.all(subtitlePromises);
  subtitlesArray.forEach(providerSubtitles => mergeSubtitles(subtitles, providerSubtitles));

  return subtitles;
};

const sortSubtitlesByFilename = (subtitles, filename) => {
  return subtitles.map(s => {
    const similarity = stringSimilarity.compareTwoStrings(s.id, filename);
    const percentage = (similarity * 100).toFixed(2);

    s.id = `${percentage}% [${s.provider}] ${s.id}`;
    s.score = parseFloat(percentage);
    return s;

  }).sort((a, b) => b.score - a.score);
};

const mergeSubtitles = (subtitles, providerSubtitles) => {
  const mergedSubtitles = lodash.unionBy(subtitles, providerSubtitles, 'id');
  subtitles.splice(0, subtitles.length, ...mergedSubtitles);
}

const subtitleProviders = {
  OS: osController,
  Wizdom: wizdomController,
};

const stremioService = {
  getSubtitleSrt,
  getSubtitlesList,
  sortSubtitlesByFilename,
};


export default stremioService;