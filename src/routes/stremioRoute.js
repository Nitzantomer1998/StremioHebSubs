import express from "express";

import stremioController from "../controllers/stremioController.js";
import corsMiddleware from "../middlewares/corsMiddleware.js";
import tryCatchWrapper from "../utils/tryCatchWrapper.js";


const router = express.Router();
router.get("/configure", stremioController.getConfigPage);
router.get("/:userConfig/configure", stremioController.getConfigPage);

router.get("/static/:folder/:path", stremioController.getStaticFile);
router.get("/:userConfig/static/:folder/:path", stremioController.getStaticFile);

router.get("/manifest.json", corsMiddleware, tryCatchWrapper.global(stremioController.getManifest));
router.get("/:userConfig/manifest.json", corsMiddleware, tryCatchWrapper.global(stremioController.getManifest));

router.get("/subtitles/:contentType/:compoundID/:extraArgs.json", corsMiddleware, tryCatchWrapper.global(stremioController.getSubtitlesList));
router.get("/:userConfig/subtitles/:contentType/:compoundID/:extraArgs.json", corsMiddleware, tryCatchWrapper.global(stremioController.getSubtitlesList));

router.get("/subtitles/:provider/:imdbID/:season/:episode/:subtitleID", tryCatchWrapper.global(stremioController.getSubtitleContent));


export default router;