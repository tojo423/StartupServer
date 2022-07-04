const express = require("express");
const mongoose = require("mongoose");

const models = require("../../models");
const modules = require("../../modules");

const router = express.Router();

router.get(
  "/getStartups/:id",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const id = req.params.id;

    const startup = await models.Startup.findById(id);

    return res.status(200).json({
      success: true,
      startup,
    });
  })
);

router.get(
  "/getStartups",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const query = req.query;

    const findQuery = {
      status: 3,
    };
    if (query.startupId) {
      findQuery._id = new mongoose.Types.ObjectId(query.startupId);
    }
    if (query.userId) {
      findQuery.user = new mongoose.Types.ObjectId(query.userId);
    }

    let sort = {};
    if (query.sortBy) {
      const order = query.descending ? -1 : 1;
      sort = { [query.sortBy]: order };
    }

    const startup = await models.Startup.find(findQuery)
      .sort(sort)
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .populate("user")
      .populate("investments")
      .exec();

    return res.status(200).json({
      success: true,
      startup,
    });
  })
);

module.exports = router;
