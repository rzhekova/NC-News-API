const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter.js");
const articlesRouter = require("./articlesRouter.js");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter.use("/", (req, res) => {
  res.status(200).send({ status: "OK" });
});

module.exports = apiRouter;
