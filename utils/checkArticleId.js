const db = require(`../db/connection`);

exports.checkArticleId = (id) => {
  return db
    .query(
      `
        SELECT article_id FROM articles
        WHERE article_id=$1;
        `,
      [id]
    )
    .then((response) => {
      if (response.rows.length === 1) {
        return true;
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
