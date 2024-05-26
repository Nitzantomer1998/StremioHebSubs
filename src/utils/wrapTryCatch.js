import loggerService from "../services/loggerService.js";


const wrapTryCatch = (fn) => async (req, res) => {
    try { await fn(req, res); }
    catch (error) {
        if (error.message.includes("Unexpected token 'e'")) loggerService.logError(error);
        else loggerService.logError(error.message);
        res.send({ subtitles: [] });
    }
};


export default wrapTryCatch;