const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
  patchArticle,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { topic } = req.query;
  selectAllArticles(sort_by, order, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
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

exports.getCommentsByArticleId = (req, res, next) => {
  const id = req.params.id;
  selectCommentsByArticleId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticle = (req, res, next) => {
  const id = req.params.id;
  const voteInc = req.body.inc_votes;
  patchArticle(id, voteInc)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  const id = req.params.id;
  const commentBody = req.body;
  insertCommentByArticleId(id, commentBody)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
