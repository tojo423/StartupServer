const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

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
    startupRequests: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "StartupRequest",
        },
      ],
    },
    startups: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Startup",
        },
      ],
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

userSchema.plugin(passportLocalMongoose);

userSchema.pre("findOne", function (next) {
  this.populate("startupRequests");
  this.populate("startups");
  next();
});

module.exports = mongoose.model("User", userSchema);
