const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "PUT",
  route: "/banUser/:targetUserId",
  handler: modules.errorHandling.wrapAsync(async (req, res, next) => {
    const myUserId = req.user._id;

    const targetUserId = new mongoose.Types.ObjectId(req.params.targetUserId);

    if (targetUserId == myUserId) {
      throw new modules.errorHandling.AppError(
        "InvalidOperation",
        "Cannot ban self",
        409
      );
    }

    const user = await models.User.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(targetUserId) },
      {
        $set: {
          isBanned: true,
        },
      },
      {
        new: true,
      }
    ).exec();
    if (!user) {
      throw new modules.errorHandling.NotFoundError("User was not found");
    }

    const safeUser = modules.auth.safeUser(user);

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  }),
};
