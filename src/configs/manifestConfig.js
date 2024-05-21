import baseConfig from "./baseConfig.js";


const manifestConfig = {
  id: "universal-hebrew-subtitles",
  version: process.env.npm_package_version,

  catalogs: [],
  resources: ["subtitles"],
  types: ["movie", "series"],

  name: "Universal Hebrew Subtitles",
  description: "Enjoy Hebrew subtitles from all the top notch websites in one convenient location.",
  logo: `${baseConfig.BASE_URL}/static/icon.svg`,

  behaviorHints: {
    configurable: true
  },

  contactEmail: "Nitzantomer1998@gmail.com",
};


export default manifestConfig;