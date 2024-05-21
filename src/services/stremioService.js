import levenshtein from "fastest-levenshtein";

import osController from "../controllers/osController.js";
import wizdomController from "../controllers/wizdomController.js";
import lodash from "lodash";


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
  return subtitles.sort((a, b) => {
    const similarityA = levenshtein.distance(a.id, filename);
    const similarityB = levenshtein.distance(b.id, filename);

    return similarityA - similarityB;
  });
}

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