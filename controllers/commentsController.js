const { Comment } = require("../models");

const updateCommentByIdVote = (req, res, next) => {
  const { comment_id } = req.params;
  const changeVote = req.query.vote;
  return Comment.findById(comment_id)
    .then(comment => {
      if (comment === null) {
        next({
          status: 404,
          message: `Page not found for ${comment_id}`
        });
      }
      if (changeVote === "up") {
        comment.votes++;
      } else if (changeVote === "down") {
        comment.votes--;
      }
      res.status(202).send({ comment });
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return Comment.remove({ _id: comment_id })
    .then(comment => {
      if (comment.n > 0) {
        res.status(202).send({
          message: `Comment ${comment_id} has been successfully deleted`
        });
      } else {
        next({
          status: 404,
          message: `Page not found for ${comment_id}`
        });
      }
    })
    .catch(next);
};

module.exports = { updateCommentByIdVote, deleteCommentById };
