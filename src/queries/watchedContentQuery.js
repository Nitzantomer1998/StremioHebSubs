const watchedContentQuery = {
    insertWatch: "INSERT INTO watched_content (imdb_id, season, episode) VALUES ($1, $2, $3)",
    countWatches: "SELECT COUNT(*) FROM watched_content",
};


export default watchedContentQuery;