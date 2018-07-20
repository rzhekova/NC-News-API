const { Article, Comment } = require("../models");

const getAllArticles = (req, res, next) => {
  return Article.find({})
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const articleById = (req, res, next) => {
  const { article_id } = req.params;
  const changedVote = req.query.vote;
  return Article.findById(article_id)
    .then(article => {
      if (article === null) {
        next({
          status: 404,
          message: `Page not found for ${article_id}`
        });
      }
      if (article !== null) {
        const voteBefore = article.votes;
        if (changedVote === "up") {
          article.votes++;
        } else if (changedVote === "down") {
          article.votes--;
        }
        article.votes - voteBefore === 1 || article.votes - voteBefore === -1
          ? res.status(202).send({ article })
          : res.status(200).send({ article });
      }
    })
    .catch(next);
};

const getAllCommentsForSingleArticle = (req, res, next) => {
  return Comment.find({})
    .where("belongs_to")
    .eq(req.params.article_id)
    .then(comments => {
      comments.length === 0
        ? next({
            status: 404,
            message: `Page not found for ${req.params.article_id}`
          })
        : res.status(200).send({ comments });
    })
    .catch(next);
};

const addCommentToArticle = (req, res, next) => {
  const newComment = new Comment(req.body);
  newComment["belongs_to"] = req.params.article_id;
  Article.find({})
    .where("_id")
    .eq(req.params.article_id)
    .then(article => {
      if (article[0]) {
        return Comment.create(newComment)
          .then(comment => {
            res.status(201).send({ comment });
          })
          .catch(next);
      } else {
        next({
          status: 404,
          message: `Page not found for ${req.params.article_id}`
        });
      }
    });
};

module.exports = {
  getAllArticles,
  articleById,
  getAllCommentsForSingleArticle,
  addCommentToArticle
};
