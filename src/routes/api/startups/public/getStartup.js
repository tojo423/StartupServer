const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "GET",
  route: "/getStartup/:startupId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const startupId = req.params.startupId;

    const startup = await models.Startup.findById(startupId);

    return res.status(200).json({
      success: true,
      startup,
    });
  }),
};
