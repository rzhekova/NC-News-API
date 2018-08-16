const { User } = require("../models");

const getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  return User.findOne({ username })
    .then(user => {
      user === null
        ? next({ status: 404, message: `${username} does not exist` })
        : res.status(200).json(user);
    })
    .catch(next);
};

const getAllUsers = (req, res, next) => {
  return User.find({})
    .then(users => res.status(200).json({ users }))
    .catch(next);
};

module.exports = { getUserByUsername, getAllUsers };
