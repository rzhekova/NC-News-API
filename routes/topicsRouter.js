const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getArticlesByTopic,
  addArticleToTopic
} = require("../controllers/topicsController");

topicsRouter.route("/").get(getAllTopics);
topicsRouter
  .route("/:topic_slug/articles")
  .get(getArticlesByTopic)
  .post(addArticleToTopic);

module.exports = topicsRouter;
