import subsrt from "subsrt";


const stremioSupportedSubFormat = ["srt", "str", "vtt"];
const librarySupportedSubFormat = ["lrc", "smi", "ssa", "ass", "sbv", "json"];

const convertSubtitle = (subtitleContent) => {
    const detectedFormat = subsrt.detect(subtitleContent);

    if (stremioSupportedSubFormat.includes(detectedFormat)) return subtitleContent;
    if (librarySupportedSubFormat.includes(detectedFormat)) return subsrt.convert(subtitleContent, {});

    throw new Error("Unsupported Subtitle Format");
};


export default convertSubtitle;