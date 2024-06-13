import baseConfig from "./baseConfig.js";


const manifestConfig = {
    id: "heb-subs",
    version: process.env.npm_package_version,

    catalogs: [],
    resources: ["subtitles"],
    types: ["movie", "series"],
    behaviorHints: { configurable: true },

    name: "Heb Subs",
    description: "Enjoy Hebrew subtitles from all the top notch websites in one convenient location.",
    logo: `${baseConfig.BASE_URL}/static/icons/icon.svg`,

    contactEmail: "Nitzantomer1998@gmail.com",
};


export default manifestConfig;