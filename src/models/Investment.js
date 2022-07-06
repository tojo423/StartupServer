const mongoose = require("mongoose");
const betterId = require("mongoose-better-id");

/* 
  Investments contains a pointer to their User and Startup

  But, Users and Startups do not contain pointers to Investments

  As in the one-to-many relationship the Investments are the many

  They only will contain references to the ones

  As to abide to the principle of cardinality
*/

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

investmentSchema.plugin(betterId, {
  connection: mongoose.connection,
  field: "_id",
  prefix: "Investment--",
});

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;
