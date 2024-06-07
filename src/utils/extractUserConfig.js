const extractUserConfig = (userConfig) => userConfig === undefined ? ["Wizdom"] : JSON.parse(atob(userConfig));


export default extractUserConfig;