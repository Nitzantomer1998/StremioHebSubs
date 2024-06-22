import chardet from "chardet";
import iconv from "iconv-lite";

import httpService from "./httpService.js";
import subtitleConfig from "../configs/subtitleConfig.js";
import divideSubtitle from "../utils/divideSubtitle.js";
import googleApi from "../apis/googleApi.js";


const cleanSubtitle = (subtitleContent) => subtitleContent.replace(/<[^>]*>/g, "");

const detectSubtitleFormat = (subtitleContent) => {
    subtitleContent = subtitleContent.trim();

    if (subtitleConfig.subtitleFormatsRegex.srt.test(subtitleContent)) return "srt";
    if (subtitleConfig.subtitleFormatsRegex.vtt.test(subtitleContent)) return "vtt";
    if (subtitleConfig.subtitleFormatsRegex.ass.test(subtitleContent)) return "ass";
    if (subtitleConfig.subtitleFormatsRegex.sub.test(subtitleContent)) return "sub";

    return "unknown";
};

const decodeSubtitle = async (subtitleContent) => {
    const bufferArray = Buffer.from(subtitleContent);
    const detectedEncoding = chardet.detect(bufferArray);
    const decodeSubtitleContent = iconv.decode(bufferArray, detectedEncoding);

    return decodeSubtitleContent;
};

const translateSubtitle = async (subtitleContent) => {
    const chunks = divideSubtitle(subtitleContent);
    const translationPromises = [];

    for (const chunk of chunks) {
        const url = `${googleApi.TRANSLATE_URL}q=${encodeURIComponent(chunk)}`;
        const promise = httpService.safeGetRequest(url)
            .then(response => response.body.json())
            .then(body => body && body[0] && body[0][0] && body[0].map(s => s[0]).join(""));

        translationPromises.push(promise);
    }
    const translations = await Promise.all(translationPromises);

    return translations.join(" ");
};

const convertSubtitle = (subtitleContent) => {
    const subtitleFormat = detectSubtitleFormat(subtitleContent);

    if (subtitleConfig.supportedSubtitleFormats.includes(subtitleFormat)) return subtitleContent;
    else if (subtitleConfig.unsupportedSubtitleFormats.includes(subtitleFormat)) return subtitleConfig.defaultSubtitleContent;
    else if (subtitleConfig.customSubtitleFormats.includes(subtitleFormat)) return subtitleConfig.subtitleConverter[subtitleFormat](subtitleContent);
    else throw new Error(`Unsupported Subtitle Format: ${subtitleFormat}`);
};

const subtitleService = {
    cleanSubtitle,
    detectSubtitleFormat,
    decodeSubtitle,
    translateSubtitle,
    convertSubtitle,
};


export default subtitleService;