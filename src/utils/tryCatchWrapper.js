import subtitleConfig from "../configs/subtitleConfig.js";
import loggerService from "../services/loggerService.js";


const global = (fn) => async (req, res) => {
    try { await fn(req, res); }
    catch (error) { loggerService.logError(error.message); res.send(fn.name === "getSubtitlesList" ? { subtitles: [] } : subtitleConfig.defaultSubtitleContent); }
};

const local = (fn) => async (...args) => {
    try { return await fn(...args); }
    catch (error) { loggerService.logError(error.message); return fn.name === "getSubtitlesList" ? [] : subtitleConfig.defaultSubtitleContent; }
};

const tryCatchWrapper = {
    local,
    global,
};


export default tryCatchWrapper;