import loggerService from "../services/loggerService.js";


const stremioSubtitleFormats = ["srt", "vtt"];
const customSubtitleFormats = ["ass"];
const ignoredSubtitleFormats = ["sub"];


const subtitleFormatRegex = {
    srt: /^(\d+)(\s*)(\d{2}:\d{2}:\d{2},\d{3})(\s*-->\s*)(\d{2}:\d{2}:\d{2},\d{3})/, // Regex for perfect SRT (there will be valid srt that are not perfect, i will catch them and improve ASAP) 
    vtt: /^(\d+)(\s*)(\d{2}:\d{2}:\d{2}\.\d{3})(\s*-->\s*)(\d{2}:\d{2}:\d{2}\.\d{3})/, // Regex for perfect VTT (there will be valid srt that are not perfect, i will catch them and improve ASAP)
    ass: /^[\s\r\n]*\[Script Info\]\r?\n.*[\s\r\n]*\[Events\]\r?\n/g,
    sub: /^\{\d+(.\d+)?\}\{\d+(.\d+)?\}(.*)/,
};

const detectSubtitleFormat = (subtitleContent) => {
    subtitleContent = subtitleContent.trim();

    if (subtitleFormatRegex.sub.test(subtitleContent)) return "sub";
    if (subtitleFormatRegex.vtt.test(subtitleContent)) return "vtt";
    if (subtitleFormatRegex.ass.test(subtitleContent)) return "ass";
    if (subtitleFormatRegex.srt.test(subtitleContent)) return "srt";

    return "unknown";
};

const convertSubtitleContent = (subtitleFormat, subtitleContent) => {
    const converters = {
        ass: convertAssToSrt,
    };

    return converters[subtitleFormat] ? converters[subtitleFormat](subtitleContent) : "";
};

const convertAssToSrt = (subtitleContent) => {
    let srtContent = "";
    let eventCount = 0;

    const lines = subtitleContent.split("\n");
    const dialogueRegex = /Dialogue: \d+,(\d+:\d+:\d+\.\d+),(\d+:\d+:\d+\.\d+),.*,,\d+,\d+,\d+,,(.*)/;

    lines.forEach(line => {
        const match = dialogueRegex.exec(line);

        if (match) {
            eventCount++;

            const start = match[1].replace(".", ",");
            const end = match[2].replace(".", ",");
            const text = match[3].replace(/\\N/g, "\n");

            srtContent += `${eventCount}\n${start} --> ${end}\n${text}\n\n`;
        }
    });

    return srtContent.trim();
};


const convertSubtitle = (subtitleContent) => {
    const detectedFormat = detectSubtitleFormat(subtitleContent);

    if (stremioSubtitleFormats.includes(detectedFormat)) return subtitleContent;
    if (customSubtitleFormats.includes(detectedFormat)) return convertSubtitleContent(detectedFormat, subtitleContent);
    if (ignoredSubtitleFormats.includes(detectedFormat)) return "";

    loggerService.logError(`Unsupported Subtitle Format: ${detectedFormat}`);
    return "";
};

export default convertSubtitle;
