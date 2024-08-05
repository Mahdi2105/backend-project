const express = require("express");
const { getTopics } = require("../controllers/topics.controllers");
const { getEndpoints } = require("../controllers/endpoints.controllers");
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  updateArticle,
} = require("../controllers/articles.controllers");
const { removeComment } = require("../controllers/comments.controllers");
const { getUsers } = require("../controllers/users.controllers");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

app.route("/api").get(getEndpoints);

app.route("/api/topics").get(getTopics);

app.route("/api/users").get(getUsers);

app.route("/api/articles").get(getArticles);

app.route("/api/articles/:id").get(getArticleById).patch(updateArticle);

app.route("/api/comments/:id").delete(removeComment);

app
  .route("/api/articles/:id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

app.use((err, req, res, next) => {
  console.log(err);
  if (err.code === "23502" || err.code === "22P02" || err.code === "23503") {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
