const commentsRouter = require("express").Router();
const {
  updateCommentByIdVote,
  deleteCommentById
} = require("../controllers/commentsController.js");

commentsRouter.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});
commentsRouter
  .route("/:comment_id")
  .put(updateCommentByIdVote)
  .delete(deleteCommentById);

module.exports = commentsRouter;
