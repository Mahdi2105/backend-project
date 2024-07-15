const { selectArticleById } = require("../models/articles.models");

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
