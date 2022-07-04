const express = require("express");
const mongoose = require("mongoose");

const models = require("../../models");
const middleware = require("../../middleware");
const modules = require("../../modules");

const env = process.env;

const router = express.Router();

router.post(
  "/createStartup",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startupData = req.body.startup;

    const startup = await models.Startup({
      ...startupData,
      user: user,
    });
    await startup.save();

    return res.status(200).json({
      success: true,
      startup,
    });
  })
);

router.get(
  "/getStartups",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const query = req.query;

    const findQuery = { user };
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
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startupId = req.params.startupId;
    const legalDocumentUrls = req.body.legalDocumentUrls;

    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
      user,
    }).exec();

    console.log("startup", startup);

    if (startup.status > 1) {
      throw new modules.errorHandling.AppError(
        "InvalidOperation",
        "Cannot submit legal documents in this status",
        409
      );
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
  "/deleteStartup/:startupId",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startupId = req.params.startupId;

    const startup = await models.Startup.findOne({
      _id: new mongoose.Types.ObjectId(startupId),
      user,
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

router.post(
  "/createInvestment/:startupId",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const tierIndex = req.body.tierIndex;

    const startupId = req.params.startupId;

    const startup = await models.Startup.findById(startupId);
    if (!startup) {
      throw new modules.errorHandling.NotFoundError("Startup not found");
    }

    const amount = startup.investmentTiers[tierIndex].amount;

    const investment = new models.Investment({
      user,
      startup,
      selectedTierIndex: tierIndex,
      startupOwner: startup.user,
      amount,
    });
    await investment.save();

    return res.status(200).json({
      success: true,
      investment,
    });
  })
);

router.get(
  "/getIncomingInvestments",
  modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const query = req.query;
    console.log(query);

    const findQuery = {
      startupOwner: user,
    };
    if (query.startupId) {
      findQuery.startup = new mongoose.Types.ObjectId(query.startupId);
    }
    if (query.status) {
      findQuery.status = query.status;
    }

    const investments = await models.Investment.find(findQuery)
      .skip(query.skip || 0)
      .limit(query.limit || 100)
      .exec();

    return res.status(200).json({
      success: true,
      investments,
    });
  })
);

router.put(
  "/setInvestmentStatus/:investmentId",
  modules.errorHandling.wrapAsync(async (req, res) => {
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
  })
);

module.exports = router;
