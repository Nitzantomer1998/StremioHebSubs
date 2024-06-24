import subtitleConverterHelper from "../helpers/subtitleConverterHelper.js";


const defaultSubtitleContent = "1\n00:00:00,000 --> 23:59:59,000\nהכתובית אינה תקינה, אנא נסו אחרת\n\n";

const supportedSubtitleFormats = ["srt"];
const unsupportedSubtitleFormats = ["sub"];
const customSubtitleFormats = ["vtt", "ass"];

const subtitleFormatsRegex = {
    srt: /(\d+)(\s*)(\d+:\d+:\d+,\d+)(\s*-->\s*)(\d+:\d+:\d+,\d+)/,
    vtt: /(\d+:\d+:\d+\.\d+)(\s*-->\s*)(\d+:\d+:\d+\.\d+)/,
    ass: /(Dialogue:)(\s*)(\d+,)(\d+:\d+:\d+\.\d+,)(\d+:\d+:\d+\.\d+,)(.*,)(.*,)(\d+,\d+,\d+,),/,
    sub: /(\{\d+\})(\{\d+\})/,
};

const subtitleConverter = {
    vtt: subtitleConverterHelper.convertVTT,
    ass: subtitleConverterHelper.convertASS,
};

const subtitleConfig = {
    defaultSubtitleContent,
    supportedSubtitleFormats,
    unsupportedSubtitleFormats,
    customSubtitleFormats,
    subtitleFormatsRegex,
    subtitleConverter,
};


export default subtitleConfig;