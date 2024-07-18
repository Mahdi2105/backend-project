const db = require("../db/connection");
const { checkArticleId } = require("../utils/checkArticleId");
const { checkTopic } = require("../utils/checkTopic");
const { checkUser } = require("../utils/checkUser");
const { getVotes } = require("../utils/getVote");

exports.selectAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validQueries = [
    "article_id",
    "author",
    "title",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];

  if (!validQueries.includes(sort_by) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Please enter a valid query" });
  }

  const topicArray = [];

  let sqlString = `SELECT a.article_id, a.author, a.title, a.topic, a.created_at, a.votes, a.article_img_url,
    COUNT(c.article_id) AS comment_count
    FROM articles a 
    JOIN comments c ON a.article_id = c.article_id `;

  if (topic) {
    sqlString += `WHERE topic = $1 `;
    topicArray.push(topic);
  }

  sqlString += `
    GROUP BY a.article_id
    ORDER BY ${sort_by} ${order};`;

  if (topic) {
    return checkTopic(topic).then(() => {
      return db.query(sqlString, topicArray).then(({ rows }) => {
        return rows;
      });
    });
  }
  return db.query(sqlString).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (id) => {
  return checkArticleId(id).then(() => {
    return db
      .query(
        `SELECT COUNT(c.article_id) AS comment_count, a.* FROM articles a
        JOIN comments c ON a.article_id = c.article_id
        WHERE a.article_id = $1
        GROUP BY a.article_id;`,
        [id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};

exports.selectCommentsByArticleId = (id) => {
  return checkArticleId(id).then(() => {
    return db
      .query(
        `SELECT * FROM comments c WHERE c.article_id = $1 ORDER BY created_at DESC;`,
        [id]
      )
      .then(({ rows }) => {
        return rows;
      });
  });
};

exports.patchArticle = (id, voteInc) => {
  return checkArticleId(id)
    .then(() => {
      return getVotes(id);
    })
    .then((votes) => {
      const newVote = votes + voteInc;
      return db.query(
        `
      UPDATE articles 
      SET votes = $1 
      WHERE article_id = $2
      RETURNING *;`,
        [newVote, id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertCommentByArticleId = (id, commentBody) => {
  const { username, body } = commentBody;

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return checkArticleId(id)
    .then(() => {
      return checkUser(username);
    })
    .then(() => {
      return db.query(
        `
      INSERT INTO comments
      (author, body, article_id)
      VALUES ($1,$2,$3)
      RETURNING *;`,
        [username, body, id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
