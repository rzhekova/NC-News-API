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
  res.status(200).json({ message: "Welcome to NC News!" });
});

app.use("/api", apiRouter);

// error handlers for 404s
app.get("/*", (req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.use((err, req, res, next) => {
  err.status ? res.status(404).json({ message: err.message }) : next(err);
});

// error handler for 400s/500s
app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    res.status(400).json({ message: `Bad request : ${err.value} is invalid` });
  }
  if (err.name === "ValidationError") {
    res
      .status(400)
      .json({ message: "Bad request : required fields are missing" });
  }
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
