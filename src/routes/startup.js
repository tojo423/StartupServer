const express = require("express");
const mongoose = require("mongoose");

const models = require("../models");
const middleware = require("../middleware");
const modules = require("../modules");

const env = process.env;

const router = express.Router();

// [GET] getStartups?startupId=test&userId=test&sortBy=test&descending=false&skip=0&limit=10

// [POST] createStartup [user]
// [GET] getMyStartups?startupId=test&status=0&sortBy=test&descending=false&skip=0&limit=10 [user]
// [PUT] submitLegalDocs [user]
// [DELETE] deleteMyStartupById/:id [user]

// [GET] getPendingStartups?status=0 [admin]
// [GET] getPendingStartup/:id [admin]
// [PUT] setStartupStatusById/:id [admin]
// [DELETE] deleteStartupById/:id [admin]
// [PUT] updateStartup/:id [admin]

// [GET] getMyInvestmentsByMyStartupId/:id [user]
// [PUT] setMyInvestmentStatusById/:id [user]
// [POST] investInStartupById/:id [user]

router.get(
  "/getStartups",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const query = req.query;

    const findQuery = {};
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

/* ---------------------------------------------------------------- */

router.post(
  "/createStartup",
  middleware.auth.authenticateJwt(),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const startupData = req.body.startup;

    const startup = await models.Startup({
      ...startupData,
      user: new mongoose.Types.ObjectId(userId),
    });
    await startup.save();

    return res.status(200).json({
      success: true,
      startup,
    });
  })
);

router.get(
  "/getMyStartups",
  middleware.auth.authenticateJwt(),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const query = req.query;

    const findQuery = { user: new mongoose.Types.ObjectId(userId) };
    if (query.startupId) {
      findQuery._id = new mongoose.Types.ObjectId(query.startupId);
    }
    if (query.status) {
      findQuery.status = query.status;
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
      .populate("investments")
      .exec();

    return res.status(200).json({
      success: true,
      startups,
    });
  })
);

router.put(
  "/submitLegalDocuments/:startupId",
  middleware.auth.authenticateJwt(),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const startupId = req.params.startupId;
    const legalDocumentUrls = req.body.legalDocumentUrls;

    console.log(userId, startupId);

    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
      user: new mongoose.Types.ObjectId(userId),
    }).exec();

    console.log("startup", startup);

    if (startup.status > 1) {
      throw new modules.errorHandling.AppError("", "", 409);
    }

    for (let url of legalDocumentUrls) {
      if (!startup.legalDocumentUrls.includes(url)) {
        startup.legalDocumentUrls.push(url);
      }
    }

    startup.status = 1;

    await startup.save();

    return res.status(200).json({
      success: true,
      startup,
    });
  })
);

router.delete(
  "/deleteMyStartup/:startupId",
  middleware.auth.authenticateJwt(),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;
    const userId = user._id;

    const startupId = req.params.startupId;

    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
      user: new mongoose.Types.ObjectId(userId),
    }).exec();
    if (!startup) {
      throw new modules.errorHandling.NotFoundError("Startup not found");
    }

    if (startup.status == 2) {
      throw new modules.errorHandling.CannotDeleteError(
        "Cannot delete startup"
      );
    }

    await startup.delete();

    return res.status(200).json({
      success: true,
    });
  })
);

/* ---------------------------------------------------------------- */

router.get(
  "/getPendingStartups",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
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
      .populate("investments")
      .exec();

    return res.status(200).json({
      success: true,
      startups,
    });
  })
);

router.put(
  "/setStartupStatus/:startupId",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
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

router.get(
  "/deleteStartup/:startupId",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
  modules.errorHandling.wrapAsync(async (req, res) => {
    const startupId = req.params.startupId;

    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
    }).exec();

    if (!startup) {
      throw new modules.errorHandling.NotFoundError("Startup not found");
    }

    await startup.delete();

    return res.status(200).json({
      success: true,
    });
  })
);

router.put(
  "/updateStartup/:startupId",
  middleware.auth.authenticateJwt(),
  middleware.auth.requiresRole(2),
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
