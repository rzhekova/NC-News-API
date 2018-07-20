const { Article, Topic } = require("../models");

const getAllTopics = (req, res, next) => {
  Topic.find({})
    .then(topics => {
      res.status(200).json({ topics });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  return Article.find({})
    .where("belongs_to")
    .eq(req.params.topic_slug)
    .populate({ path: "created_by", select: "username" })
    .then(articles => {
      if (articles.length > 0) {
        res.status(200).json({ articles });
      } else
        next({
          status: 404,
          message: `Page not found for ${req.params.topic_slug}`
        });
    })
    .catch(next);
};

const addArticleToTopic = (req, res, next) => {
  const newArticle = new Article(req.body);
  newArticle["belongs_to"] = req.params.topic_slug;

  Topic.find({})
    .where("slug")
    .eq(req.params.topic_slug)
    .then(topic => {
      if (topic[0]) {
        return Article.create(newArticle)
          .then(article => {
            res.status(201).json({ article });
          })
          .catch(next);
      } else {
        next({
          status: 404,
          message: `Page not found for ${req.params.topic_slug}`
        });
      }
    })
    .catch(next);
};

module.exports = { getAllTopics, getArticlesByTopic, addArticleToTopic };
