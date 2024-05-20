import db from "../configs/dbConfig.js";
import addonInstallQuery from "../queries/addonInstallQuery.js";
import downloadedContentQuery from "../queries/downloadedContentQuery.js";
import watchedContentQuery from "../queries/watchedContentQuery.js";


const insertAddonInstall = async (userConfig) => { db.query(addonInstallQuery.insertInstall, userConfig); };
const insertDownloadedContent = async (provider, imdbID, season, episode) => { db.query(downloadedContentQuery.insertDownload, [provider, imdbID, season, episode]); };
const insertWatchedContent = async (imdbID, season, episode) => { db.query(watchedContentQuery.insertWatch, [imdbID, season, episode]); };

const dbService = {
    insertAddonInstall,
    insertDownloadedContent,
    insertWatchedContent,
};


export default dbService;