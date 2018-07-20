const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api.js");
app.use(bodyParser.json());

const { DB_URL } =
  process.env.NODE_ENV === "production"
    ? process.env
    : require("./config/config.js");

mongoose.connect(DB_URL).then(() => {
  console.log(`Connected to ${DB_URL}`);
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my home-page...");
});
app.use("/api", apiRouter);

// error handler for 404s
app.use((err, req, res, next) => {
  err.status ? res.status(404).send(err.message) : next(err);
});

// error handler for 400s/500s
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).send({ message: `Bad request : ${err.value} is invalid` });
  }
  if (err.name === "ValidationError") {
    res
      .status(400)
      .send({ message: "Bad request : required fields are missing" });
  }
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
