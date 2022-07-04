const express = require("express");
const multer = require("multer");
const path = require("path");

const middleware = require("../middleware");
const modules = require("../modules");

const router = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + "-" + Date.now() + path.extname(file.originalname)
    ); //Appending extension
  },
});
const upload = multer({ storage });

/*
  gets startup request by id authored by the authenticated user
*/
router.post(
  "/upload",
  middleware.auth.authenticateJwt(),
  upload.array("files", 5),
  modules.errorHandling.wrapAsync(async (req, res) => {
    console.log(req.files);
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
  })
);

module.exports = router;
