const watchedContentQuery = {
    insertWatch: "INSERT INTO watched_content (imdb_id, season, episode) VALUES ($1, $2, $3)",
};


export default watchedContentQuery;