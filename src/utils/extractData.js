import extractCompoundID from "./extractCompoundID.js";
import extractFilename from "./extractFilename.js";
import extractUserConfig from "./extractUserConfig.js";
import dataValidation from "../validations/dataValidation.js";


const extractData = (params) => {
    const { userConfig: encodedUserConfig, contentType, compoundID, extraArgs } = params;
    const [imdbID, season, episode] = extractCompoundID(compoundID);
    const filename = extractFilename(extraArgs);
    const userConfig = extractUserConfig(encodedUserConfig);

    const valid = dataValidation(contentType, imdbID, season, episode);
    if (valid === false) throw new Error(`Invalid Data: ContentType=${contentType}, imdbID=${imdbID}, season=${season}, episode=${episode}`);

    return { userConfig, imdbID, season, episode, filename };
};


export default extractData;