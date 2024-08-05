const express = require("express");
const { getTopics } = require("../controllers/topics.controllers");
const { getEndpoints } = require("../controllers/endpoints.controllers");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.use((err, req, res, next) => {
  if (err.code === "23502" || err.code === "22P02") {
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
