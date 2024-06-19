import subtitleConverterHelper from "../helpers/subtitleConverterHelper.js";


const defaultSubtitleContent = "1\n00:00:00,000 --> 23:59:59,000\nהכתובית אינה תקינה, אנא נסו אחרת\n\n";

const supportedSubtitleFormats = ["srt", "vtt"];
const customSubtitleFormats = ["ass"];
const unsupportedSubtitleFormats = ["sub"];

const subtitleFormatsRegex = {
    srt: /^(\d+)(\s*)(\d{2}:\d{2}:\d{2},\d{3})(\s*-->\s*)(\d{2}:\d{2}:\d{2},\d{3})/,
    vtt: /^(\d+)(\s*)(\d{2}:\d{2}:\d{2}\.\d{3})(\s*-->\s*)(\d{2}:\d{2}:\d{2}\.\d{3})/,
    ass: /^[\s\r\n]*\[Script Info\]\r?\n.*[\s\r\n]*\[Events\]\r?\n/g,
    sub: /^(\{\d+\})(\{\d+\})/,
};

const subtitleConverter = {
    ass: subtitleConverterHelper.convertAssToSrt,
};

const subtitleConfig = {
    defaultSubtitleContent,

    supportedSubtitleFormats,
    customSubtitleFormats,
    unsupportedSubtitleFormats,

    subtitleFormatsRegex,
    subtitleConverter,
};


export default subtitleConfig;