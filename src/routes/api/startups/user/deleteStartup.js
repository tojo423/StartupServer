const express = require("express");
const mongoose = require("mongoose");

const models = require("../../../../models");
const modules = require("../../../../modules");

module.exports = {
  method: "DELETE",
  route: "/deleteStartup/:startupId",
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    const user = req.user;

    const startupId = req.params.startupId;

    const startup = await models.Startup.findOne({ user, startupId });
    if (startup.status == 3) {
      throw new modules.errorHandling.AppError(
        "InvalidOperation",
        "Cannot delete an approved startup",
        409
      );
    }

    const deleteResult = await startup.delete();

    return res.status(200).json({
      success: true,
      deleteResult,
    });
  }),
};
