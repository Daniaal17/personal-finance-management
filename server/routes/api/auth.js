const passport = require("passport");
const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const { auth } = require("../../middlewares");
const { FRONTEND_URL, BACKEND_URL } = require("../../config");
const {
  ResponseHandler,
  sendEmail,

  schemaValidator,
} = require("../../utils");

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get("/context", auth.required, auth.user, async (request, response) => {
  try {
    if (request.user.status === "inactive")
      return ResponseHandler.badRequest(
        response,
        "You've been blocked by the admin! Contact support to unblock."
      );
    return ResponseHandler.ok(response, request.user.toAuthJSON());
  } catch (error) {
    console.log(error, "error");
    return ResponseHandler.badRequest(response, error);
  }
});

router.post("/create/user", async (request, response) => {
  try {
    const { fullName, email, phone, role } = request.body;
    const errors = schemaValidator(request.body, {
      email: "string",
      fullName: "string",
      phone: "number",
      role: "string",
    });
    if (errors.length)
      return ResponseHandler.badRequest(response, errors.join(", "));

    const exsUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!exsUser) return ResponseHandler.badRequest(response, "User not found");

    let user = new User({
      fullName: fullName,
      email: email.trim().toLowerCase(),
      role: role,
      phone: phone,
      status: "active",
    });

    await user.save();
    if (user.status === "pending")
      return ResponseHandler.badRequest(response, "Otp is not verified!");
    if (user.status === "inactive")
      return ResponseHandler.badRequest(
        response,
        "You've been blocked by the admin! Contact support to unblock."
      );
    return ResponseHandler.ok(response, { user: user.toAuthJSON() });
  } catch (err) {
    console.log(err, "error");
    return ResponseHandler.badRequest(response, err);
  }
});

router.post("/signup", async (request, response) => {
  const { name, email, password, currency } = request.body;
  try {
    const errors = schemaValidator(request.body, {
      name: "string",
      email: "string",
      password: "string",
      currency: "string",
    });
    if (errors.length)
      return ResponseHandler.badRequest(response, errors.join(", "));

    const exsUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (exsUser)
      return ResponseHandler.badRequest(response, "User already exists");

    let user = new User({
      fullName: name,
      email: email.trim().toLowerCase(),

      currency: currency,
    });
    user.setPassword(password);
    user.setOTP();

    await user.save();
    sendEmail(user, "Verify Your Email Address", { verifyEmail: true });
    return ResponseHandler.ok(
      response,
      "User signed up successfully! Please verify your email address to login"
    );
  } catch (err) {
    console.log(err, "err");
    return ResponseHandler.badRequest(response, err);
  }
});

module.exports = router;
