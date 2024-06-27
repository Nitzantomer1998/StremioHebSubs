import chardet from "chardet";
import iconv from "iconv-lite";

import httpService from "./httpService.js";
import subtitleConfig from "../configs/subtitleConfig.js";
import divideSubtitle from "../utils/divideSubtitle.js";
import googleApi from "../apis/googleApi.js";


const subtitlePipeline = async (subtitleContent, isTranslated = true) => {
    const decodedSubtitle = await decodeSubtitle(subtitleContent);
    const detectedSubtitleFormat = detectSubtitleFormat(decodedSubtitle);
    const cleanedSubtitle = cleanSubtitle(decodedSubtitle);
    const convertedSubtitle = convertSubtitle(cleanedSubtitle, detectedSubtitleFormat);
    const translatedSubtitle = isTranslated ? convertedSubtitle : await translateSubtitle(convertedSubtitle);
    const fixedSubtitle = fixSubtitlePunctuation(translatedSubtitle);

    return fixedSubtitle;
};

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

const cleanSubtitle = (subtitleContent) => {
    const removedTags = subtitleContent.replace(/<[^>]*>/g, "");
    const removedParentheses = removedTags.replace(/\([^\)]*\)/g, "");
    const removedCurlyBrackets = removedParentheses.replace(/\{[^\}]*\}/g, "");
    const removedSquareBrackets = removedCurlyBrackets.replace(/\[[^\]]*\]/g, "");

    return removedSquareBrackets;
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
    const punctuationRegex = /[.,?!:]+$/;
    const hebrewRegex = /[\u0590-\u05FF]+/;
    const modifiedSubtitleLines = [];

    const subtitleLines = subtitleContent.split("\n");
    for (let subtitleLine of subtitleLines) {
        if (hebrewRegex.test(subtitleLine)) {
            subtitleLine = subtitleLine.replace(/-/g, "");

            const match = subtitleLine.match(punctuationRegex);
            if (match) subtitleLine = match[0] + subtitleLine.slice(0, -match[0].length);
        }

        modifiedSubtitleLines.push(subtitleLine);
    }

    return modifiedSubtitleLines.join("\n");
};

const subtitleService = {
    subtitlePipeline,
    decodeSubtitle,
};


export default subtitleService;