const addonInstallQuery = {
    insertInstall: 'INSERT INTO addon_installs (userConfig) VALUES ($1)',
    countInstalls: 'SELECT COUNT(*) FROM addon_installs'
};


export default addonInstallQuery;