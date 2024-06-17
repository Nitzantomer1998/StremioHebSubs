import chardet from "chardet";
import iconv from "iconv-lite";

import subtitleConfig from "../configs/subtitleConfig.js";


const convertSubtitle = (subtitleContent) => {
    const subtitleFormat = detectSubtitleFormat(subtitleContent);

    if (subtitleConfig.supportedSubtitleFormats.includes(subtitleFormat)) return content;
    if (subtitleConfig.customSubtitleFormats.includes(subtitleFormat)) return subtitleConfig.subtitleConverter[subtitleFormat](subtitleContent);
    if (subtitleConfig.unsupportedSubtitleFormats.includes(subtitleFormat)) return "";

    loggerService.logError(`Unsupported Subtitle Format: ${subtitleFormat}`);
    return "";
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

const subtitleService = {
    convertSubtitle,
    detectSubtitleFormat,
    decodeSubtitle,
};


export default subtitleService;