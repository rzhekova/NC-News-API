const usersRouter = require("express").Router();
const getUserByUsername = require("../controllers/usersController.js");

usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
