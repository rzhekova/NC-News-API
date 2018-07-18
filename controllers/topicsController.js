const { Article, Topic } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find({})
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  return Article.find({})
    .where("belongs_to")
    .eq(req.params.topic_slug)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

module.exports = { getAllTopics, getArticlesByTopic };
