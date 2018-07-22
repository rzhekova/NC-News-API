const { Article, Topic, Comment } = require("../models");

const getAllTopics = (req, res, next) => {
  return Topic.find({})
    .then(topics => {
      res.status(200).json({ topics });
    })
    .catch(next);
};

const getArticlesByTopic = (req, res, next) => {
  return Article.find({})
    .where("belongs_to")
    .eq(req.params.topic_slug)
    .populate("created_by")
    .lean()
    .then(articles => {
      const commentCountArray = articles.map(article => {
        return Comment.find({})
          .where("belongs_to")
          .eq(article._id)
          .count();
      });
      return Promise.all([articles, ...commentCountArray]);
    })
    .then(([articles, ...commentCountArray]) => {
      if (commentCountArray.length === 0) {
        next({
          status: 404,
          message: `Topic ${req.params.topic_slug} does not exist`
        });
      } else {
        const articlesWithCommentCount = articles.map((article, index) => {
          return { ...article, comments: commentCountArray[index] };
        });
        res.status(200).json({ articles: articlesWithCommentCount });
      }
    })
    .catch(next);
};

const addArticleToTopic = (req, res, next) => {
  const newArticle = new Article(req.body);
  newArticle["belongs_to"] = req.params.topic_slug;
  return Topic.find({})
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
          message: `Topic ${req.params.topic_slug} does not exist`
        });
      }
    })
    .catch(next);
};

module.exports = { getAllTopics, getArticlesByTopic, addArticleToTopic };
