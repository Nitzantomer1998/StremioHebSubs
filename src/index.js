import express from "express";

import baseConfig from "./configs/baseConfig.js";
import stremioRoute from "./routes/stremioRoute.js";
import loggerService from "./services/loggerService.js";


const addon = express();
addon.use("/", stremioRoute);
addon.listen(baseConfig.PORT, () => { loggerService.logExpress(); });


export default addon;