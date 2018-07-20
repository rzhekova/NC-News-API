const { Article, Comment } = require("../models");

const getAllArticles = (req, res, next) => {
  return Article.find({})
    .populate("created_by")
    .lean()
    .then(articles => {
      const commentCount = articles.map(article => {
        return Comment.find({})
          .where("belongs_to")
          .eq(article._id)
          .count();
      });
      return Promise.all([articles, ...commentCount]);
    })
    .then(([articles, ...commentCountArray]) => {
      const articlesWithComments = articles.map((article, index) => {
        return { ...article, comments: commentCountArray[index] };
      });
      res.status(200).json({ articles: articlesWithComments });
    })
    .catch(next);
};

const articleById = (req, res, next) => {
  const { article_id } = req.params;
  const changeVote = req.query.vote;
  Comment.find({})
    .where("belongs_to")
    .eq(article_id)
    .count()
    .then(commentCount => {
      Article.findById(article_id)
        .populate("created_by")
        .lean()
        .then(article => {
          if (article === null) {
            next({
              status: 404,
              message: `Page not found for ${article_id}`
            });
          }
          if (article !== null) {
            article["comments"] = commentCount;
            const voteBefore = article.votes;
            if (changeVote === "up") {
              article.votes++;
            } else if (changeVote === "down") {
              article.votes--;
            }
            article.votes - voteBefore === 1 ||
            article.votes - voteBefore === -1
              ? res.status(202).json({ article })
              : res.status(200).json({ article });
          }
        })
        .catch(next);
    })
    .catch(next);
};

const getAllCommentsForSingleArticle = (req, res, next) => {
  return Comment.find({})
    .where("belongs_to")
    .eq(req.params.article_id)
    .populate("created_by")
    .populate("belongs_to")
    .then(comments => {
      comments.length === 0
        ? next({
            status: 404,
            message: `Page not found for ${req.params.article_id}`
          })
        : res.status(200).json({ comments });
    })
    .catch(next);
};

const addCommentToArticle = (req, res, next) => {
  const newComment = req.body;
  newComment["belongs_to"] = req.params.article_id;
  return Article.findOne({})
    .where("_id")
    .eq(req.params.article_id)
    .populate("created_by")
    .then(article => {
      if (article) {
        return Comment.create(newComment)
          .then(comment => {
            return Comment.findById(comment._id)
              .populate("created_by")
              .then(comment => res.status(201).json(comment));
          })
          .catch(next);
      } else {
        next({
          status: 404,
          message: `Page not found for ${req.params.article_id}`
        });
      }
    })
    .catch(next);
};

module.exports = {
  getAllArticles,
  articleById,
  getAllCommentsForSingleArticle,
  addCommentToArticle
};
