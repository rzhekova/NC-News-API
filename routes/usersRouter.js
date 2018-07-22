const usersRouter = require("express").Router();
const getUserByUsername = require("../controllers/usersController.js");

usersRouter.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
