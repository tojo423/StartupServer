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
        startupOwner: user,
      },
      {
        $set: {
          status: newStatus,
        },
      },
      {
        new: true,
      }
    )
      .populate("startup")
      .exec();

    console.log(investment.startup.user._id, user._id);
    if (!investment.startup.user._id.equals(user._id)) {
      throw new modules.errorHandling.AppError(
        "Forbidden",
        "Cannot modify investment owned by other startup",
        403
      );
    }

    return res.status(200).json({
      success: true,
      investment,
    });
  }),
};
