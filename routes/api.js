const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter.js");

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/", (req, res) => {
  res.status(200).send({ status: "OK" });
});

module.exports = apiRouter;
