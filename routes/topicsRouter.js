const topicsRouter = require("express").Router();
const {
  getAllTopics,
  getArticlesByTopic
} = require("../controllers/topicsController");

topicsRouter.route("/").get(getAllTopics);
topicsRouter.route("/:topic_slug/articles").get(getArticlesByTopic);

module.exports = topicsRouter;
