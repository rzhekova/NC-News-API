const { Comment } = require("../models");

const updateCommentVote = (req, res, next) => {
  const { comment_id } = req.params;
  const changeVote = req.query.vote;
  if (changeVote === "up") {
    return Comment.findByIdAndUpdate(
      comment_id,
      { $inc: { votes: 1 } },
      { new: true }
    )
      .populate("created_by")
      .lean()
      .then(comment => {
        comment === null
          ? next({
              status: 404,
              message: `Comment ${comment_id} does not exist`
            })
          : res.status(202).json({ comment });
      })
      .catch(next);
  }
  if (changeVote === "down") {
    return Comment.findByIdAndUpdate(
      comment_id,
      { $inc: { votes: -1 } },
      { new: true }
    )
      .populate("created_by")
      .lean()
      .then(comment => {
        comment === null
          ? next({
              status: 404,
              message: `Comment ${comment_id} does not exist`
            })
          : res.status(202).json({ comment });
      })
      .catch(next);
  }
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

module.exports = { updateCommentVote, deleteCommentById };
