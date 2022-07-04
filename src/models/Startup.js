const mongoose = require("mongoose");

var investmentTierSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  investment: {
    type: Number,
  },
  equity: {
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
    description: {
      type: String,
    },
    companyName: {
      type: String,
    },
    currentNetWorth: {
      type: Number,
    },
    image: {
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
    investments: {
      type: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Investment",
        },
      ],
      default: [],
    },
    status: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    legalDocumentUrls: {
      type: [
        {
          type: String,
        },
      ],
      default: [],
    },
  },

  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Startup = mongoose.model("Startup", startupSchema);

module.exports = Startup;
