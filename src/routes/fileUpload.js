const express = require("express");
const multer = require("multer");
const path = require("path");

const middleware = require("../middleware");
const modules = require("../modules");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

/*
  gets startup request by id authored by the authenticated user
*/
router.post(
  "/upload",
  middleware.auth.authenticateJwt(),
  upload.array("files", 5),
  modules.errorHandling.wrapAsync(async (req, res) => {
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
