const db = require(`../db/connection`);

exports.checkTopic = (topic) => {
  return db
    .query(
      `
        SELECT topic FROM articles
        WHERE topic=$1;
        `,
      [topic]
    )
    .then((response) => {
      console.log(response);
      if (response.rows.length > 0) {
        return true;
      } else {
        return Promise.reject({ status: 404, msg: "Topic not found" });
      }
    });
};
