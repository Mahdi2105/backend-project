const db = require(`../db/connection`);

exports.checkUser = (username) => {
  console.log("HELLO");
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
        return false;
      }
    });
};
