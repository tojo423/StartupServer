const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const models = require("../models");
const middleware = require("../middleware");
const modules = require("../modules");

const env = process.env;

const router = express.Router();

/*
  gets startup request by id authored by the authenticated user
*/
router.get(
  "/:id",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const startupRequestId = req.params.id;

    const startupRequest = await models.StartupRequest.findOne({
      _id: new mongoose.Types.ObjectId(startupRequestId),
      user: new mongoose.Types.ObjectId(userId),
    });

    return res.status(200).json({
      success: true,
      startupRequests: startupRequest,
    });
  })
);

/*
  gets all startup requests for the authenticated user
*/
router.get(
  "/",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const startupRequests = await models.StartupRequest.find({
      user: new mongoose.Types.ObjectId(userId),
    })
      .populate("user")
      .exec();

    return res.status(200).json({
      success: true,
      startupRequests: startupRequests,
    });
  })
);

/*
  gets any startup request by id
*/
router.get(
  "/admin/:id",
  middleware.auth.requiresRole(2),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const startupRequestId = req.params.id;

    const startupRequest = await models.StartupRequest.findById(
      startupRequestId
    );

    return res.status(200).json({
      success: true,
      startupRequests: startupRequest,
    });
  })
);

/*
  gets all startup requests
*/
router.get(
  "/admin",
  middleware.auth.requiresRole(2),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const startupRequests = await models.StartupRequest.find()
      .populate("user")
      .exec();

    return res.status(200).json({
      success: true,
      startupRequests: startupRequests,
    });
  })
);

/*
  creates a new startup request for the authenticated user
*/
router.post(
  "/",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startup = req.body.startup;

    const startupRequest = new models.StartupRequest({
      startup,
      user,
    });
    await startupRequest.save();

    return res.status(200).json({
      success: true,
      startupRequest,
    });
  })
);

router.post(
  "/:id/uploadLegal",
  upload.array("documents"),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const documentUrls = req.files.map((file) => {
      return file.path;
    });

    const startupRequest = user.startupRequests.push(startupRequest);
    await user.save();

    await startupRequest.save();

    return res.status(200).json({
      success: true,
      startupRequest,
    });
  })
);

/*

*/
router.post(
  "/approve",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const startup = req.body.startup;

    const startupRequest = new models.StartupRequest({
      startup,
      user: new mongoose.Types.ObjectId(userId),
    });

    await startupRequest.save();

    return res.status(200).json({
      success: true,
      startupRequest,
    });
  })
);

module.exports = router;
