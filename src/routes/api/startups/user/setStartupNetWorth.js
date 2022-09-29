const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "PUT",
  route: "/setStartupNetWorth/:startupId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startupId = req.params.startupId;
    const newNetWorth = req.body.netWorth;

    // find startup by id, owned by the requesting user
    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
      user: new mongoose.Types.ObjectId(user._id),
    }).exec();

    if (!startup) {
      throw new modules.errorHandling.NotFoundError("Startup not found");
    }

    // append to its net worth
    startup.netWorth.push(newNetWorth);
    await startup.save();

    return res.status(200).json({
      success: true,
      startup,
    });
  }),
};
