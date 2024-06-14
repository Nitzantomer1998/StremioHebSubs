import loggerConfig from "../configs/loggerConfig.js";


const logError = (error) => { loggerConfig.error(["Error", error]); };
const logInstall = (userConfig) => { loggerConfig.info(["Install", `Addon Installed, userConfig=${userConfig}`]); };
const logExpress = () => { loggerConfig.info(["Express", "Express Connected"]); };
const logDatabase = () => { loggerConfig.info(["Database", "Database Connected"]); };
const logDownload = (provider, subtitleID) => { loggerConfig.info(["Download", `provider=${provider}, subtitleID=${subtitleID}`]); };
const logWatch = (imdbID, season, episode, filename) => { loggerConfig.info(["Watch", `imdbID=${imdbID}, season=${season}, episode=${episode}, filename=${filename}`]); };

const loggerConfigService = {
    logError,
    logInstall,
    logExpress,
    logDatabase,
    logDownload,
    logWatch,
};


export default loggerConfigService;