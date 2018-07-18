process.env.NODE_ENV = "test";
const seedDB = require("../seed/seed.js");
const rawData = require("../seed/testData");
const { expect } = require("chai");
const app = require("../app");
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
  // it("responds with 404 when a route is not found", () => {
  //   return request.get("/api/animal").expect(404);
  // });
  it("responds with 200 when a route is successfully reached", () => {
    return request.get("/api").expect(200);
  });
});
describe("/api/topics", () => {
  beforeEach(() => {
    return seedDB(rawData);
  });
  describe("/", () => {
    it("GET request with 200 and returns all topics", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(res => {
          expect(res.body.topics[0]).to.be.an("object");
          expect(res.body.topics.length).to.equal(2);
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
        .get("/api/topics/mitch/articles")
        .expect(200)
        .then(res => {
          expect(res.body.articles[0]).to.be.an("object");
          expect(res.body.articles.length).to.equal(2);
          expect(res.body.articles[0]).to.have.all.keys(
            "_id",
            "title",
            "body",
            "created_by",
            "created_at",
            "belongs_to",
            "votes",
            "__v"
          );
        });
      // fix to include comment count key/value pair
    });
    // it("POST request with 201 and returns the added article", () => {});
  });
});
