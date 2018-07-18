const mongoose = require("mongoose");
mongoose.Promise = Promise;
const { Article, Comment, Topic, User } = require("../models");
const { createRef } = require("../utils/indexUtils");

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
    })
    .then(() => {
      console.log("seeded into topics and users");
    });
};

module.exports = seedDB;
