const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      `
    SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url,
    COUNT(c.article_id) AS comment_count
    FROM articles a 
    JOIN comments c ON a.article_id = c.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectArticleById = (id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};
