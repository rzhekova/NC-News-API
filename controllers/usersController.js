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

module.exports = getUserByUsername;
