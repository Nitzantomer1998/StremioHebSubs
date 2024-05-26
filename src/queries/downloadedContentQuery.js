const downloadedContentQuery = {
    insertDownload: "INSERT INTO downloaded_content (provider, imdb_id, season, episode) VALUES ($1, $2, $3, $4)",
    countDownloads: "SELECT COUNT(*) FROM downloaded_content",
};


export default downloadedContentQuery;