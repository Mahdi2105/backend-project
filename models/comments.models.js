const db = require("../db/connection");
const { checkCommentId } = require("../utils/checkCommentId");

exports.deleteComment = (id) => {
  return checkCommentId(id)
    .then(() => {
      return db.query(
        `
      DELETE FROM comments 
      WHERE comment_id = $1
      RETURNING *;`,
        [id]
      );
    })
    .then(({ rows }) => {
      console.log(rows[0]);
      return rows[0];
    });
};
