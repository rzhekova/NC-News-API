const commentsRouter = require("express").Router();
const {
  updateCommentByIdVote,
  deleteCommentById
} = require("../controllers/commentsController.js");

commentsRouter
  .route("/:comment_id")
  .put(updateCommentByIdVote)
  .delete(deleteCommentById);

module.exports = commentsRouter;
