import chardet from "chardet";
import iconv from "iconv-lite";

import httpService from "./httpService.js";
import subtitleConfig from "../configs/subtitleConfig.js";
import divideSubtitle from "../utils/divideSubtitle.js";
import googleApi from "../apis/googleApi.js";


const subtitlePipeline = async (subtitleContent, isTranslated = true) => {
    const cleanedSubtitle = cleanSubtitle(subtitleContent);
    const decodedSubtitle = await decodeSubtitle(cleanedSubtitle);
    const detectedSubtitleFormat = detectSubtitleFormat(decodedSubtitle);
    const convertedSubtitle = convertSubtitle(decodedSubtitle, detectedSubtitleFormat);
    const translatedSubtitle = isTranslated ? convertedSubtitle : await translateSubtitle(convertedSubtitle);
    const fixedSubtitle = fixSubtitlePunctuation(translatedSubtitle);

    return fixedSubtitle;
};
const cleanSubtitle = (subtitleContent) => subtitleContent.replace(/<[^>]*>/g, "");
const decodeSubtitle = async (subtitleContent) => {
    const bufferArray = Buffer.from(subtitleContent);
    const detectedEncoding = chardet.detect(bufferArray);
    const decodeSubtitleContent = iconv.decode(bufferArray, detectedEncoding);

    return decodeSubtitleContent;
};
const detectSubtitleFormat = (subtitleContent) => {
    subtitleContent = subtitleContent.trim();

    if (subtitleConfig.subtitleFormatsRegex.srt.test(subtitleContent)) return "srt";
    if (subtitleConfig.subtitleFormatsRegex.vtt.test(subtitleContent)) return "vtt";
    if (subtitleConfig.subtitleFormatsRegex.ass.test(subtitleContent)) return "ass";
    if (subtitleConfig.subtitleFormatsRegex.sub.test(subtitleContent)) return "sub";

    return "unknown";
};
const convertSubtitle = (subtitleContent, subtitleFormat) => {
    if (subtitleConfig.supportedSubtitleFormats.includes(subtitleFormat)) return subtitleContent;
    else if (subtitleConfig.unsupportedSubtitleFormats.includes(subtitleFormat)) return subtitleConfig.defaultSubtitleContent;
    else if (subtitleConfig.customSubtitleFormats.includes(subtitleFormat)) return subtitleConfig.subtitleConverter[subtitleFormat](subtitleContent);
    else throw new Error(`Unsupported Subtitle Format: ${subtitleFormat}`);
};
const translateSubtitle = async (subtitleContent) => {
    const chunks = divideSubtitle(subtitleContent);
    const translationPromises = [];

    for (const chunk of chunks) {
        const url = `${googleApi.TRANSLATE_URL}q=${encodeURIComponent(chunk)}`;
        const promise = httpService.safeGetRequest(url)
            .then(response => response.body.json())
            .then(body => body[0].map(s => s[0]).join(""));

        translationPromises.push(promise);
    }
    const translations = await Promise.all(translationPromises);

    return translations.join(" ");
};
const fixSubtitlePunctuation = (subtitleContent) => {
    const punctuationMarks = ["...", "..", ".", ",", "?", "!", ":"];
    const modifiedSubtitleLines = [];

    const subtitleLines = subtitleContent.split("\n");
    for (let subtitleLine of subtitleLines) {
        subtitleLine = subtitleLine.replace(/-/g, "");

        for (const mark of punctuationMarks) {
            if (subtitleLine.endsWith(mark)) {
                subtitleLine = mark + subtitleLine.slice(0, -mark.length);
                break;
            }
        }

        modifiedSubtitleLines.push(subtitleLine);
    }

    return modifiedSubtitleLines.join("\n");
};

const subtitleService = {
    subtitlePipeline,
};


export default subtitleService;