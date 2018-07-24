const commentsRouter = require("express").Router();
const {
  updateCommentVote,
  deleteCommentById
} = require("../controllers/commentsController.js");

commentsRouter.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});
commentsRouter
  .route("/:comment_id")
  .put(updateCommentVote)
  .delete(deleteCommentById);

module.exports = commentsRouter;
