const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

const router = express.Router();

module.exports = {
  method: "DELETE",
  route: "/deleteStartup/:startupId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const startupId = req.params.startupId;

    const result = await models.Startup.deleteOne({
      _id: new mongoose.Types.ObjectId(startupId),
    }).exec();

    return res.status(200).json({
      success: true,
      result,
    });
  }),
};
