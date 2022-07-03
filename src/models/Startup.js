const mongoose = require("mongoose");

var investmentTierSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  amount: {
    type: Number,
  },
});

var startupSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    companyName: {
      type: String,
    },
    email: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    websiteUrl: {
      type: String,
    },
    about: {
      type: String,
    },
    pitchDocumentUrl: {
      type: String,
    },
    investmentTiers: {
      type: [investmentTierSchema],
    },
    request: {
      type: mongoose.Types.ObjectId,
      ref: "StartupRequest",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Startup = mongoose.model("Startup", startupSchema);

module.exports = { startupSchema, Startup };
