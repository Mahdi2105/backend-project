const db = require("../db/connection");
const { checkArticleId } = require("../utils/checkArticleId");

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
  return checkArticleId(id).then(() => {
    return db
      .query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
      .then(({ rows }) => {
        return rows[0];
      });
  });
};

exports.selectCommentsByArticleId = (id) => {
  return checkArticleId(id).then(() => {
    return db
      .query(`SELECT * FROM comments c WHERE c.article_id = $1;`, [id])
      .then(({ rows }) => {
        return rows;
      });
  });
};
