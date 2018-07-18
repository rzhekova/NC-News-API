const mongoose = require("mongoose");
mongoose.Promise = Promise;
const { Article, Comment, Topic, User } = require("../models");
const {
  createRef,
  formatArticleData,
  formatCommentData
} = require("../utils/indexUtils");

const seedDB = ({ topicData, commentData, userData, articleData }) => {
  return mongoose.connection
    .dropDatabase()
    .then(() => {
      return Topic.insertMany(topicData);
    })
    .then(topicDocs => {
      return Promise.all([topicDocs, User.insertMany(userData)]);
    })
    .then(([topicDocs, userDocs]) => {
      const topicReference = createRef(topicData, "slug", topicDocs);
      const userReference = createRef(userData, "username", userDocs);
      const formattedArticles = formatArticleData(
        articleData,
        topicReference,
        userReference
      );
      return Promise.all([
        userReference,
        topicDocs,
        userDocs,
        Article.insertMany(formattedArticles)
      ]);
    })
    .then(([userReference, topicDocs, userDocs, articleDocs]) => {
      const articleReference = createRef(articleData, "title", articleDocs);
      const formattedComments = formatCommentData(
        commentData,
        userReference,
        articleReference
      );
      return Promise.all([
        topicDocs,
        userDocs,
        articleDocs,
        Comment.insertMany(formattedComments)
      ]);
    })
    .then(() => {
      console.log("seeded into topics, users, movies");
    });
};

module.exports = seedDB;
