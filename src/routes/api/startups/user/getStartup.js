const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getStartup/:startupId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startupId = req.params.startupId;

    const startup = await models.Startup.findOne({
      user,
      _id: new mongoose.Types.ObjectId(startupId),
    });

    return res.status(200).json({
      success: true,
      startup,
    });
  }),
};
