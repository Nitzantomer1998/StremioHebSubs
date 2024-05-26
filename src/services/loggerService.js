import logger from "../utils/logger.js";


const logError = (error) => { logger.error(["Error", error]); };
const logInstall = (userConfig) => { logger.info(["Install", `Addon Installed, userConfig=${userConfig}`]); };
const logExpress = () => { logger.info(["Express", "Express Connected"]); };
const logDatabase = () => { logger.info(["Database", "Database Connected"]); };
const logDownload = (provider, subtitleID) => { logger.info(["Download", `provider=${provider}, subtitleID=${subtitleID}`]); };
const logWatch = (imdbID, season, episode) => { logger.info(["Watch", `imdbID=${imdbID}, season=${season}, episode=${episode}`]); };

const loggerService = {
    logError,
    logInstall,
    logExpress,
    logDatabase,
    logDownload,
    logWatch,
};


export default loggerService;