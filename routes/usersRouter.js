const usersRouter = require("express").Router();
const getUserByUsername = require("../controllers/usersController.js");

usersRouter.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});
usersRouter.get("/:username", getUserByUsername);
// edit get request above to say users/:username

// add get request for all users

module.exports = usersRouter;
