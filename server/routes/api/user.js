const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const { auth } = require("../../middlewares");
const {
  ResponseHandler,
  imageUploader,
  schemaValidator,
} = require("../../utils");
const router = express.Router();
const imgUpload = imageUploader.fields([{ name: "profileImg", maxCount: 1 }]);

router.get("/context", (request, response) => {
  // logger.info("User context retrieved successfully!");
  return ResponseHandler.ok(
    response,
    "User context retrieved successfully...!"
  );
});

module.exports = router;
