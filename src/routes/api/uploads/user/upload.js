const express = require("express");
const multer = require("multer");
const path = require("path");
const slugify = require("slugify");

const middleware = require("../../../../middleware");
const modules = require("../../../../modules");

const MAX_FILE_SIZE = 5242880; // bytes (5 megabytes)

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      slugify(file.originalname) +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    ); //Appending extension
  },
});
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

module.exports = {
  method: "POST",
  route: "/upload",
  preware: [upload.array("files", 5)],
  handler: modules.errorHandling.wrapAsync(async (req, res) => {
    console.log("files", req.files);
    const fileUrls = req.files.map((file) => {
      const cleaned = file.path.replace(
        String.fromCharCode(92),
        String.fromCharCode(92, 92)
      );
      return cleaned;
    });

    return res.status(200).json({
      success: true,
      fileUrls,
    });
  }),
};
