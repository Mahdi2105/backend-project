const {
  selectArticleById,
  selectAllArticles,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.id;
  selectArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
