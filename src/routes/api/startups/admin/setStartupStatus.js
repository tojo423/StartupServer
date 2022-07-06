const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "PUT",
  route: "/setStartupStatus/:startupId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const startupId = req.params.startupId;

    const newStatus = req.body.status;

    const startup = await models.Startup.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(startupId),
      },
      {
        $set: {
          status: newStatus,
        },
      },
      {
        new: true,
      }
    ).exec();

    return res.status(200).json({
      success: true,
      startup,
    });
  }),
};