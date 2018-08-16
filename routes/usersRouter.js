const usersRouter = require("express").Router();
const {
  getUserByUsername,
  getAllUsers
} = require("../controllers/usersController.js");

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUserByUsername);

module.exports = usersRouter;
