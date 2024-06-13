const downloadedContentQuery = {
    insertDownload: "INSERT INTO downloaded_content (provider, imdb_id, season, episode) VALUES ($1, $2, $3, $4)",
};


export default downloadedContentQuery;