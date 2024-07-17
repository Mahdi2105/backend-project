const db = require(`../db/connection`);

exports.checkUser = (username) => {
  return db
    .query(
      `
        SELECT username FROM users
        WHERE username=$1;
        `,
      [username]
    )
    .then((response) => {
      if (response.rows.length === 1) {
        return true;
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    });
};
