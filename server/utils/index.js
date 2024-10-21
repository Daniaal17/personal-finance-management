module.exports = {
  ...require("./responseHandler.js"),
  ...require("./passport"),
  ...require("./validators.js"),
  ...require("./nodemailer.js"),
  ...require("./multer.js"),
};
