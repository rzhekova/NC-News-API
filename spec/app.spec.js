process.env.NODE_ENV = "test";
const seedDB = require("../seed/seed.js");
const testData = require("../seed/testData");
const { expect } = require("chai");
const app = require("../app");
const mongoose = require("mongoose");
const request = require("supertest")(app);

describe("/", () => {
  it("responds with 404 when a route is not found", () => {
    return request.get("/animal").expect(404);
  });
  it("responds with 200 when a route is successfully reached", () => {
    return request.get("/").expect(200);
  });
});

describe("/api", () => {
  // it("responds with 400 when a route is not found", () => {
  // const badEndpoint = 'animal'
  //   return request.get(`/api/${badEndpoint}`).expect(400).then(res => {
  // expect(res.message).to.equal(`Bad request!`)
  //});
  // });
  it("responds with 200 when a route is successfully reached", () => {
    return request
      .get("/api")
      .expect(200)
      .then(res => {
        expect(res.body).to.eql({ status: "OK" });
      });
  });
});

let articleDocs;
let commentDocs;
let userDocs;
let topicDocs;
beforeEach(() => {
  return seedDB(testData).then(docs => {
    [topicDocs, userDocs, articleDocs, commentDocs] = docs;
  });
});
after(() => {
  return mongoose.disconnect();
});
describe("/api/topics", () => {
  describe("/", () => {
    it("GET request with 200 and returns all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.be.an("object");
          expect(res.body.topics.length).to.equal(2);
          expect(res.body.topics[0]._id).to.equal(topicDocs[0]._id.toString());
          expect(res.body.topics[0]).to.have.all.keys(
            "_id",
            "title",
            "slug",
            "__v"
          );
        });
    });
  });
  describe("/:topic_slug/articles", () => {
    it("GET request with 200 and returns all articles for specific topic", () => {
      return request
        .get(`/api/topics/${topicDocs[0].slug}/articles`)
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.be.an("object");
          expect(res.body.articles[0]._id).to.equal(
            articleDocs[0]._id.toString()
          );
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0]).to.contain.keys(
            "_id",
            "title",
            "body",
            "created_by",
            "created_at",
            "belongs_to",
            "votes"
          );
        });
      // fix to include comment count key/value pair
    });
    it("GET responds with 404 when topic slug is invalid", () => {
      const badTopicSlug = 4521;
      return request
        .get(`/api/topics/${badTopicSlug}/articles`)
        .expect(404)
        .then(res => {
          expect(res.text).to.equal(`Page not found for ${badTopicSlug}`);
        });
    });
    it("POST responds with 201 and returns added article", () => {
      const newArticle = {
        title: "a",
        body: "b",
        created_by: userDocs[0]._id
      };
      return request
        .post("/api/topics/mitch/articles")
        .send(newArticle)
        .expect(201)
        .then(res => {
          expect(res.body.article).to.be.an("object");
          expect(res.body.article).to.contain.keys(
            "_id",
            "title",
            "votes",
            "body",
            "created_by",
            "belongs_to",
            "created_at",
            "__v"
          );
        });
    });
    it("POST responds with 400 when new article does not contain required properties", () => {
      const newArticle = { animal: "cat" };
      return request
        .post("/api/topics/mitch/articles")
        .send(newArticle)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "Bad request : required fields are missing"
          );
        });
    });
    // write 404 for posting the right format article for an invalid slug e.g./api/topics/tom/articles
    it("POST responds with 404 when new article is in valid format but title slug is ivalid", () => {
      const badTopicSlug = "lol";
      const newArticle = {
        title: "a",
        body: "b",
        created_by: userDocs[0]._id
      };
      return request
        .post(`/api/topics/${badTopicSlug}/articles`)
        .send(newArticle)
        .expect(404)
        .then(res => {
          expect(res.text).to.equal(`Page not found for ${badTopicSlug}`);
        });
    });
  });
});

describe("/api/articles", () => {
  describe("/", () => {
    it("GET request with 200 and returns all articles", () => {
      return request
        .get("/api/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.be.an("object");
          expect(res.body.articles.length).to.equal(4);
          expect(res.body.articles[0]._id).to.equal(
            articleDocs[0]._id.toString()
          );
          expect(res.body.articles[0]).to.contain.keys(
            "_id",
            "title",
            "votes",
            "body",
            "created_by",
            "belongs_to",
            "created_at",
            "__v"
          );
        });
    });
  });
  describe("/:article_id", () => {
    it("GET responds with 200 and returns an article by its ID", () => {
      const articleID = articleDocs[1]._id;
      return request
        .get(`/api/articles/${articleID}`)
        .expect(200)
        .then(res => {
          expect(res.body.article).to.be.an("object");
          expect(res.body.article).to.contain.keys(
            "_id",
            "title",
            "votes",
            "body",
            "created_by",
            "belongs_to",
            "created_at",
            "__v"
          );
        });
    });
    it("GET responds with 400 when article id is not in the right format", () => {
      const wrongFormatId = "blah12345";
      return request
        .get(`/api/articles/${wrongFormatId}`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            `Bad request : ${wrongFormatId} is invalid`
          );
        });
    });
    it("GET responds with 404 when id is in right format but incorrect", () => {
      const badId = userDocs[0]._id;
      return request
        .get(`/api/articles/${badId}`)
        .expect(404)
        .then(res => {
          expect(res.text).to.equal(`Page not found for ${badId}`);
        });
    });
    it("PUT responds with 202 and returns the updated article", () => {
      const articleID = articleDocs[0]._id;
      return request
        .put(`/api/articles/${articleID}?vote=down`)
        .expect(202)
        .then(res => {
          expect(res.body.article.votes).to.equal(-1);
        });
    });
    it("PUT responds with 400 when article_id format is invalid", () => {
      const wrongFormatId = "blah12345";
      return request
        .put(`/api/articles/${wrongFormatId}?vote=down`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            `Bad request : ${wrongFormatId} is invalid`
          );
        });
    });
    it("PUT responds with 404 when article_id is incorrect but in right format", () => {
      const badId = userDocs[0]._id;
      return request
        .put(`/api/articles/${badId}?vote=down`)
        .expect(404)
        .then(res => {
          expect(res.text).to.equal(`Page not found for ${badId}`);
        });
    });
  });
  describe("/:article_id/comments", () => {
    it("GET responds with 200 and returns all comments per article", () => {
      const articleID = articleDocs[0]._id;
      return request
        .get(`/api/articles/${articleID}/comments`)
        .expect(200)
        .then(res => {
          expect(res.body.comments.length).to.equal(2);
          expect(res.body.comments[0]).that.contain.keys(
            "belongs_to",
            "votes",
            "body",
            "created_at",
            "_id"
          );
        });
    });
    it("GET responds with 400 when article id is not in the right format", () => {
      const wrongFormatId = "hello";
      return request
        .get(`/api/articles/${wrongFormatId}/comments`)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            `Bad request : ${wrongFormatId} is invalid`
          );
        });
    });
    it("GET responds with 404 when id is in right format but incorrect", () => {
      const badId = userDocs[0]._id;
      return request
        .get(`/api/articles/${badId}/comments`)
        .expect(404)
        .then(res => {
          expect(res.text).to.equal(`Page not found for ${badId}`);
        });
    });
    it("POST responds with 201 and returns added comment", () => {
      const articleID = articleDocs[1]._id;
      const newComment = {
        body: "a",
        created_by: userDocs[1]._id
      };
      return request
        .post(`/api/articles/${articleID}/comments`)
        .send(newComment)
        .expect(201)
        .then(res => {
          expect(res.body.comment).to.be.an("object");
          expect(res.body.comment).to.contain.keys(
            "_id",
            "body",
            "belongs_to",
            "__v",
            "votes"
          );
        });
    });
    it("POST responds with 400 if new comment is in the wrong format", () => {
      const badFromatComment = { animal: "cat" };
      const articleID = articleDocs[1]._id;

      return request
        .post(`/api/articles/${articleID}/comments`)
        .send(badFromatComment)
        .expect(400)
        .then(res => {
          expect(res.body.message).to.equal(
            "Bad request : required fields are missing"
          );
        });
    });
    it("POST responds with 404 if new comment is in right format but posted to an invalid articleId", () => {
      const newComment = { body: "a", created_by: userDocs[1]._id };
      const badId = userDocs[0]._id;

      return request
        .post(`/api/articles/${badId}/comments`)
        .send(newComment)
        .expect(404)
        .then(res => {
          expect(res.text).to.equal(`Page not found for ${userDocs[0]._id}`);
        });
    });
  });
});

describe("/api/comments", () => {
  it("PUT responds with 202 and returns the updated comment", () => {
    const commentId = commentDocs[1]._id;
    return request
      .put(`/api/comments/${commentId}?vote=up`)
      .expect(202)
      .then(res => {
        expect(res.body.comment.votes).to.equal(20);
      });
  });
  it("PUT responds with 400 when comment_id format is invalid", () => {
    const wrongFormatId = "blah12345";
    return request
      .put(`/api/comments/${wrongFormatId}?vote=up`)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal(
          `Bad request : ${wrongFormatId} is invalid`
        );
      });
  });
  it("PUT responds with 404 when comment_id is incorrect but in right format", () => {
    const badId = userDocs[0]._id;
    return request
      .put(`/api/comments/${badId}?vote=down`)
      .expect(404)
      .then(res => {
        expect(res.text).to.equal(`Page not found for ${badId}`);
      });
  });
  it("DELETE responds with 202 and returns a message", () => {
    const commentId = commentDocs[1]._id;
    return request
      .delete(`/api/comments/${commentId}`)
      .expect(202)
      .then(res => {
        expect(res.body.message).to.equal(
          `Comment ${commentId} has been successfully deleted`
        );
      });
  });
  it("DELETE responds with 400 when when comment_id format is invalid", () => {
    const wrongFormatId = "blah12345";
    return request
      .delete(`/api/comments/${wrongFormatId}`)
      .expect(400)
      .then(res => {
        expect(res.body.message).to.equal(
          `Bad request : ${wrongFormatId} is invalid`
        );
      });
  });
  it("DELETE responds with 404 when comment_id is incorrect but in right format", () => {
    const badId = userDocs[0]._id;
    return request
      .delete(`/api/comments/${badId}`)
      .expect(404)
      .then(res => {
        expect(res.text).to.equal(`Page not found for ${badId}`);
      });
  });
});
