import express from "express";

import stremioController from "../controllers/stremioController.js";
import corsMiddleware from "../middlewares/corsMiddleware.js";
import wrapTryCatch from "../utils/wrapTryCatch.js";


const router = express.Router();
router.get("/static/:path", stremioController.getStaticFile);
router.get("/:userConfig/static/:path", stremioController.getStaticFile);

router.get("/configure", stremioController.getConfigPage);
router.get("/:userConfig/configure", stremioController.getConfigPage);

router.get("/manifest.json", corsMiddleware, wrapTryCatch(stremioController.getManifest));
router.get("/:userConfig/manifest.json", corsMiddleware, wrapTryCatch(stremioController.getManifest));

router.get("/subtitles/:provider/:imdbID/:season/:episode/:subtitleID.srt", wrapTryCatch(stremioController.getSubtitleSrt));

router.get("/subtitles/:contentType/:compoundID/:extraArgs.json", corsMiddleware, wrapTryCatch(stremioController.getSubtitlesList));
router.get("/:userConfig/subtitles/:contentType/:compoundID/:extraArgs.json", corsMiddleware, wrapTryCatch(stremioController.getSubtitlesList));


export default router;