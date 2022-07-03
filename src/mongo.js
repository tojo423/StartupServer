const mongoose = require("mongoose");

const env = process.env;

const mongoUri = env.MONGO_URI || "mongodb://localhost:27017/startup";
mongoose.connect(mongoUri, {}, (err) => {
  if (!err) {
    console.log("MongoDB Connection Succeeded.");
  } else {
    console.log("Error in DB connection: " + err);
  }
});
