import baseConfig from "../configs/baseConfig.js";
import ktuvitConfig from "../configs/ktuvitConfig.js";


const fetchSubtitles = async (imdbID, season, episode) => {
    const ktuvitID = await ktuvitConfig.getKtuvitID({ imdbId: imdbID });
    const ktuvitSubtitles = season ? await ktuvitConfig.getSubsIDsListEpisode(ktuvitID, season, episode) : await ktuvitConfig.getSubsIDsListMovie(ktuvitID);

    ktuvitSubtitles.forEach((s) => {
        s.id = `${ktuvitID}-${s.id}`;
        s.name = s.subName;

        s.imdbID = imdbID;
        s.season = season;
        s.episode = episode;
    });

    return ktuvitSubtitles;
};

const mapSubtitlesToStremio = (subtitles) => {
    const stremioSubtitles = subtitles.map((s) => ({
        id: s.name,
        provider: "Ktuvit",
        score: 0,
        lang: "heb",
        url: `${baseConfig.BASE_URL}/subtitles/Ktuvit/${s.imdbID}/${s.season}/${s.episode}/${s.id}`,
    }));

    return stremioSubtitles;
};

const extractSubtitle = async (subtitleID) => {
    const [ktuvitID, subID] = subtitleID.split("-");

    const subtitlePromise = new Promise((resolve, reject) => {
        ktuvitConfig.downloadSubtitle(ktuvitID, subID, (buffer, error) => {
            if (error) { reject(error); }
            resolve(buffer);
        });
    });

    const srtContent = await subtitlePromise;
    return srtContent;
};

const ktuvitService = {
    fetchSubtitles,
    mapSubtitlesToStremio,
    extractSubtitle,
};


export default ktuvitService;