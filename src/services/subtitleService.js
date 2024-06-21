import chardet from "chardet";
import iconv from "iconv-lite";

import httpService from "./httpService.js";
import subtitleConfig from "../configs/subtitleConfig.js";
import divideSubtitle from "../utils/divideSubtitle.js";
import googleApi from "../apis/googleApi.js";


const convertSubtitle = (subtitleContent) => {
    const subtitleFormat = detectSubtitleFormat(subtitleContent);

    if (subtitleConfig.supportedSubtitleFormats.includes(subtitleFormat)) return subtitleContent;
    else if (subtitleConfig.unsupportedSubtitleFormats.includes(subtitleFormat)) return subtitleConfig.defaultSubtitleContent;
    else if (subtitleConfig.customSubtitleFormats.includes(subtitleFormat)) return subtitleConfig.subtitleConverter[subtitleFormat](subtitleContent);
    else throw new Error(`Unsupported Subtitle Format: ${subtitleFormat}`);
};

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
    const translations = [];

    for (const chunk of chunks) {
        const url = `${googleApi.TRANSLATE_URL}q=${encodeURIComponent(chunk)}`;;
        const response = await httpService.safeGetRequest(url);
        const body = await response.body.json();
        const translatedText = body && body[0] && body[0][0] && body[0].map((s) => s[0]).join("");

        translations.push(translatedText);
    }

    return translations.join(" ");
};

const subtitleService = {
    convertSubtitle,
    detectSubtitleFormat,
    decodeSubtitle,
    translateSubtitle,
};


export default subtitleService;