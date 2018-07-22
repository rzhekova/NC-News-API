process.env.NODE_ENV = process.env.NODE_ENV || "dev";

const seedDB = require("./seed.js");
const rawData = require("./devData");
const mongoose = require("mongoose");

const { DB_URL } = require("../config/config");

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log(`Connected to ${DB_URL}........`);
  })
  .then(() => {
    return seedDB(rawData);
  })
  .then(() => {
    return mongoose.disconnect();
  });
