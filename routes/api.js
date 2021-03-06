const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter.js");
const articlesRouter = require("./articlesRouter.js");
const commentsRouter = require("./commentsRouter.js");
const usersRouter = require("./usersRouter.js");

apiRouter.get("/", (req, res) => {
  res.status(200).render("api.ejs");
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
