import loggerService from "../services/loggerService.js";

const stremioSupportedSubFormats = ["srt", "str", "vtt"];
const selfSupportedSubFormats = ["ass"];
const ignoreSubFormats = ["sub"];

const convertSubtitle = (subtitleContent) => {
    const detectedFormat = detectSubtitleFormat(subtitleContent);

    if (stremioSupportedSubFormats.includes(detectedFormat)) return subtitleContent;
    if (selfSupportedSubFormats.includes(detectedFormat)) return convertFactory(detectedFormat, subtitleContent);
    if (ignoreSubFormats.includes(detectedFormat)) return "";

    loggerService.logError(`Unsupported Subtitle Format: ${detectedFormat}`);
    return "";
};

const detectSubtitleFormat = (subtitleContent) => {
    subtitleContent = subtitleContent.trim();

    if (/^WEBVTT/.test(subtitleContent)) return "vtt";
    if (/^\{\d+\}\{\d+\}/.test(subtitleContent)) return "sub";
    if (/^\[Script Info\]/.test(subtitleContent)) return "ass"; //this will identify also ssa, need to see for better way
    if (/^\d+\r\n\d+:\d+:\d+,\d+ --> \d+:\d+:\d+,\d+/.test(subtitleContent)) return "srt";

    return "unknown";
};

const convertFactory = (subtitleFormat, subtitleContent) => {
    if (subtitleFormat === "ass") return assToSrt(subtitleContent);
    return "";
};

const assToSrt = (subtitleContent) => {
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


export default convertSubtitle;