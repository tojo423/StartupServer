const mongoose = require("mongoose");

var investmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    startup: {
      type: mongoose.Types.ObjectId,
      ref: "Startup",
    },
    startupOwner: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    selectedTierIndex: {
      type: Number,
    },
    amount: {
      type: Number,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;
