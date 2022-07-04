const express = require("express");
const mongoose = require("mongoose");

const models = require("../../models");
const modules = require("../../modules");

const router = express.Router();

router.get(
  "/getPendingStartups",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const query = req.query;

    const findQuery = {
      status: { $lt: 2 },
    };
    if (query.startupId) {
      findQuery._id == new mongoose.Types.ObjectId(query.userId);
    }
    if (query.userId) {
      findQuery.userId = new mongoose.Types.ObjectId(query.userId);
    }
    if (query.statusLt) {
      findQuery.status = { $lt: query.statusLt };
    }

    let sort = {};
    if (query.sortBy) {
      const order = query.descending ? -1 : 1;
      sort = { [query.sortBy]: order };
    }

    const startups = await models.Startup.find(findQuery)
      .sort(sort)
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .populate("user")
      .exec();

    return res.status(200).json({
      success: true,
      startups,
    });
  })
);

router.put(
  "/setStartupStatus/:startupId",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const startupId = req.params.startupId;

    const newStatus = req.body.status;

    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
    }).exec();

    if (!startup) {
      throw new modules.errorHandling.NotFoundError("Startup not found");
    }

    startup.status = newStatus;
    await startup.save();

    return res.status(200).json({
      success: true,
      startup,
    });
  })
);

router.delete(
  "/deleteStartup/:startupId",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const startupId = req.params.startupId;

    const result = await models.Startup.deleteOne({
      _id: new mongoose.Types.ObjectId(startupId),
    }).exec();

    return res.status(200).json({
      success: true,
      result,
    });
  })
);

router.put(
  "/updateStartup/:startupId",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const startupId = req.params.startupId;

    const startupData = req.body.startup;

    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
    }).exec();

    if (!startup) {
      throw new modules.errorHandling.NotFoundError("Startup not found");
    }

    for (let key in startupData) {
      startup[key] = startupData[key];
    }
    await startup.save();

    return res.status(200).json({
      success: true,
      startup,
    });
  })
);

module.exports = router;
