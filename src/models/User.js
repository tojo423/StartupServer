const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const betterId = require("mongoose-better-id");

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 24,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: Number,
      default: 0,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.plugin(passportLocalMongoose);

userSchema.plugin(betterId, {
  connection: mongoose.connection,
  field: "_id",
  prefix: "User--",
});

module.exports = mongoose.model("User", userSchema);
