const { deleteComment } = require("../models/comments.models");

exports.removeComment = (req, res, next) => {
  const id = req.params.id;
  return deleteComment(id)
    .then((comment) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
