const { Comment } = require("../models");

const updateCommentByIdVote = (req, res, next) => {
  const { comment_id } = req.params;
  const changeVote = req.query.vote;
  return Comment.findByIdAndUpdate(comment_id)
    .populate("created_by")
    .then(comment => {
      if (comment === null) {
        next({
          status: 404,
          message: `Comment ${comment_id} does not exist`
        });
      }
      if (changeVote === "up") {
        comment.votes++;
      } else if (changeVote === "down") {
        comment.votes--;
      }
      res.status(202).json({ comment });
    })
    .catch(next);
};

const deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  return Comment.findByIdAndRemove(comment_id)
    .populate("created_by")
    .then(comment => {
      if (comment !== null) {
        res.status(202).json({
          message: `Comment ${comment_id} has been successfully deleted`
        });
      } else {
        next({
          status: 404,
          message: `Comment ${comment_id} does not exist`
        });
      }
    })
    .catch(next);
};

module.exports = { updateCommentByIdVote, deleteCommentById };
