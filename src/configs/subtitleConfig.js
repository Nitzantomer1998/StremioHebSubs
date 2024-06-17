import subtitleConverterHelper from "../helpers/subtitleConverterHelper.js";


const supportedSubtitleFormats = ["srt", "vtt"];
const customSubtitleFormats = ["ass"];
const unsupportedSubtitleFormats = ["sub"];

const subtitleFormatsRegex = {
    srt: /^(\d+)(\s*)(\d{2}:\d{2}:\d{2},\d{3})(\s*-->\s*)(\d{2}:\d{2}:\d{2},\d{3})/,
    vtt: /^(WEBVTT)/,
    ass: /^[\s\r\n]*\[Script Info\]\r?\n.*[\s\r\n]*\[Events\]\r?\n/g,
    sub: /^\{\d+(.\d+)?\}\{\d+(.\d+)?\}(.*)/,
};

const subtitleConverter = {
    ass: subtitleConverterHelper.convertAssToSrt,
};

const subtitleConfig = {
    supportedSubtitleFormats,
    customSubtitleFormats,
    unsupportedSubtitleFormats,

    subtitleFormatsRegex,
    subtitleConverter,
};


export default subtitleConfig;