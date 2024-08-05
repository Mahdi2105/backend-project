const db = require(`../db/connection`);

exports.checkCommentId = (id) => {
  return db
    .query(
      `
        SELECT comment_id FROM comments
        WHERE comment_id=$1;
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
