const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "POST",
  route: "/createStartup",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startupData = req.body.startup;

    const startup = new models.Startup({
      ...startupData,
      user: new mongoose.Types.ObjectId(user._id),
    });
    await startup.save();

    return res.status(200).json({
      success: true,
      startup,
    });
  }),
};
