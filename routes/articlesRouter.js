const articlesRouter = require("express").Router();
const {
  getAllArticles,
  articleById,
  getAllCommentsForSingleArticle,
  addCommentToArticle
} = require("../controllers/articlesController.js");

articlesRouter.get("/", getAllArticles);
articlesRouter
  .route("/:article_id")
  .get(articleById)
  .put(articleById);

articlesRouter
  .route("/:article_id/comments")
  .get(getAllCommentsForSingleArticle)
  .post(addCommentToArticle);

module.exports = articlesRouter;
