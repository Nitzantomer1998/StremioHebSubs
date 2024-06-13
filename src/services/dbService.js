import db from "../configs/dbConfig.js";
import addonInstallQuery from "../queries/addonInstallQuery.js";
import downloadedContentQuery from "../queries/downloadedContentQuery.js";
import watchedContentQuery from "../queries/watchedContentQuery.js";


const insertAddonInstall = async (args) => { db.query(addonInstallQuery.insertInstall, args); };
const insertDownloadedContent = async (args) => { db.query(downloadedContentQuery.insertDownload, args); };
const insertWatchedContent = async (args) => { db.query(watchedContentQuery.insertWatch, args); };

const dbService = {
    insertAddonInstall,
    insertDownloadedContent,
    insertWatchedContent,
};


export default dbService;