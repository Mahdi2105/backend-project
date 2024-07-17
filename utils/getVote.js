const db = require(`../db/connection`);

exports.getVotes = (id) => {
  return db
    .query(
      `
        SELECT votes FROM articles
        WHERE article_id=$1;
        `,
      [id]
    )
    .then(({ rows }) => {
      return rows[0].votes;
    });
};
