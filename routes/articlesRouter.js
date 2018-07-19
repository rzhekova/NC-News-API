const articlesRouter = require("express").Router();
const {
  getAllArticles,
  getArticleById,
  getAllCommentsForSingleArticle,
  addCommentToArticle
} = require("../controllers/articlesController.js");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter
  .route("/:article_id/comments")
  .get(getAllCommentsForSingleArticle)
  .post(addCommentToArticle);

module.exports = articlesRouter;
