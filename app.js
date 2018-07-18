const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api.js");
app.use(bodyParser.json());
let DB_URL;

process.env.NODE_ENV === "test"
  ? (DB_URL = "mongodb://localhost:27017/nc_news_test")
  : (DB_URL = "mongodb://localhost:27017/nc_news");

mongoose.connect(DB_URL).then(() => {
  console.log(`Connected to ${DB_URL}`);
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to my home-page...");
});

app.use("/api", apiRouter);

app.get("/*", (req, res) => {
  res.status(404).send({ msg: "ERROR: Page not found" });
});

app.use((err, req, res, next) => {
  console.log(err, "***********");
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
