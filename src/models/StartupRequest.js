const mongoose = require("mongoose");
const { startupSchema } = require("./Startup");

var startupRequestSchema = new mongoose.Schema(
  {
    startup: {
      type: startupSchema,
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

const StartupRequest = mongoose.model("StartupRequest", startupRequestSchema);

module.exports = StartupRequest;
