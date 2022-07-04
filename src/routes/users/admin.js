const express = require("express");
const mongoose = require("mongoose");

const models = require("../../models");
const middleware = require("../../middleware");
const modules = require("../../modules");

const router = express.Router();

router.get(
  "/getUsers",
  modules.errorHandling.wrapAsync(async (req, res, next) => {
    const users = await models.User.find({}).populate("startups").exec();

    const safeUsers = users.map((user) => {
      return modules.auth.safeUser(user);
    });

    return res.status(200).json({
      success: true,
      users: safeUsers,
    });
  })
);

router.put(
  "/banUser/:targetUserId",
  modules.errorHandling.wrapAsync(async (req, res, next) => {
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
      { _id: targetUserId },
      {
        $set: {
          isBanned: true,
        },
      },
      {
        new: true,
      }
    ).exec();

    const safeUser = modules.auth.safeUser(user);

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  })
);

module.exports = router;
