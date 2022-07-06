const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const middleware = require("../../../../middleware");
const modules = require("../../../../modules");

module.exports = {
  method: "PUT",
  route: "/setInvestmentStatus/:investmentId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const investmentId = req.params.investmentId;
    const newStatus = req.body.status;

    const investment = await models.Investment.findOneAndUpdate(
      {
        _id: new mongoose.Types.ObjectId(investmentId),
        startupOwner: new mongoose.Types.ObjectId(user._id),
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
      investment,
    });
  }),
};
