const { Article, Comment } = require("../models");

const getAllArticles = (req, res, next) => {
  return Article.find({})
    .populate("created_by")
    .lean()
    .then(articles => {
      const commentCountArray = articles.map(article => {
        return Comment.find({})
          .where("belongs_to")
          .eq(article._id)
          .countDocuments();
      });
      return Promise.all([articles, ...commentCountArray]);
    })
    .then(([articles, ...commentCountArray]) => {
      const articlesWithCommentCount = articles.map((article, index) => {
        return { ...article, comments: commentCountArray[index] };
      });
      res.status(200).json({ articles: articlesWithCommentCount });
    })
    .catch(next);
};

const articleById = (req, res, next) => {
  const { article_id } = req.params;
  return Comment.find({})
    .where("belongs_to")
    .eq(article_id)
    .countDocuments()
    .then(commentCount => {
      Article.findById(article_id)
        .populate("created_by")
        .lean()
        .then(article => {
          if (article === null) {
            next({
              status: 404,
              message: `Article ${article_id} does not exist`
            });
          }
          if (article !== null) {
            article["comments"] = commentCount;
            res.status(200).json({ article });
          }
        });
    })
    .catch(next);
};

const getAllCommentsForSingleArticle = (req, res, next) => {
  const { article_id } = req.params;
  Article.findById(article_id)
    .populate("created_by")
    .then(article => {
      if (!article) {
        next({
          status: 404,
          message: `Article ${article_id} does not exist`
        });
      } else
        return Comment.find({})
          .where("belongs_to")
          .eq(article._id)
          .populate("created_by")
          .populate("belongs_to")
          .then(comments => {
            res.status(200).json({ comments });
          });
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
        return Comment.create(newComment).then(comment => {
          return Comment.findById(comment._id)
            .populate("created_by")
            .then(comment => res.status(201).json(comment));
        });
      } else {
        next({
          status: 404,
          message: `Article ${req.params.article_id} does not exist`
        });
      }
    })
    .catch(next);
};

const changeArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const changeVote = req.query.vote;
  if (changeVote === "up") {
    return Article.findByIdAndUpdate(
      article_id,
      { $inc: { votes: 1 } },
      { new: true }
    )
      .populate("created_by")
      .lean()
      .then(article => {
        article === null
          ? next({
              status: 404,
              message: `Article ${req.params.article_id} does not exist`
            })
          : res.status(202).json({ article });
      })
      .catch(next);
  }
  if (changeVote === "down") {
    return Article.findByIdAndUpdate(
      article_id,
      { $inc: { votes: -1 } },
      { new: true }
    )
      .populate("created_by")
      .lean()
      .then(article => {
        article === null
          ? next({
              status: 404,
              message: `Article ${req.params.article_id} does not exist`
            })
          : res.status(202).json({ article });
      })
      .catch(next);
  }
};

module.exports = {
  getAllArticles,
  articleById,
  getAllCommentsForSingleArticle,
  addCommentToArticle,
  changeArticleVote
};
