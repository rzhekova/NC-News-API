process.env.NODE_ENV = "dev";

const seedDB = require("./seed.js");
const mongoose = require("mongoose");
const rawData = require("./devData");
const DB_URL = "mongodb://localhost:27017/nc_news";

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
