const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "POST",
  route: "/createInvestment/:startupId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const tierIndex = req.body.tierIndex;

    const startupId = req.params.startupId;

    const startup = await models.Startup.findById(startupId);
    if (!startup) {
      throw new modules.errorHandling.NotFoundError("Startup not found");
    }

    let investment = new models.Investment({
      user: new mongoose.Types.ObjectId(user._id),
      startup: new mongoose.Types.ObjectId(startup._id),
      selectedTierIndex: tierIndex,
      startupOwner: startup.user,
    });
    await investment.save();

    return res.status(200).json({
      success: true,
      investment,
    });
  }),
};
