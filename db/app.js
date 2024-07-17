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
const app = express();
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:id", getArticleById);

app.get("/api/articles/:id/comments", getCommentsByArticleId);

app.post("/api/articles/:id/comments", postCommentByArticleId);

app.patch("/api/articles/:id", updateArticle);

app.use((err, req, res, next) => {
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
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
