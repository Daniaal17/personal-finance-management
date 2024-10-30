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
// router.use(passport.session());

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
    // sendEmail(user, "Verify OTP", { verifyAccount: true });
    return ResponseHandler.ok(
      response,
      "User signed up successfully! Please verify your OTP to login"
    );
  } catch (err) {
    console.log(err, "err");
    return ResponseHandler.badRequest(response, err);
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;
    const errors = schemaValidator(request.body, {
      email: "string",
      password: "string",
    });
    if (errors.length)
      return ResponseHandler.badRequest(response, errors.join(", "));

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user)
      return ResponseHandler.badRequest(
        response,
        "Either incorrect username or password "
      );

    if (!user.isOtpVerified) {
      user.setOTP();
      await user.save();
      // sendEmail(user, "Verify OTP", { verifyAccount: true });
      return ResponseHandler.badRequest(response, "Please verify otp");
    }

    if (user.authType !== "google" && !user.hash)
      return ResponseHandler.badRequest(
        response,
        "Account setup incomplete! Please complete signup first."
      );

    if (!user.validPassword(password))
      return ResponseHandler.badRequest(response, "Invalid credentials");

    return ResponseHandler.ok(response, { user: user.toAuthJSON() });
  } catch (err) {
    console.log(err, "error");
    return ResponseHandler.badRequest(response, err);
  }
});

router.post("/otp/verify/:email/:type", async (request, response) => {
  const { otp } = request.body;
  const { email, type } = request.params;

  console.log("Hittsssssssss", otp, email);
  try {
    if (!otp) {
      return ResponseHandler.badRequest(
        response,
        "Missing required parameters"
      );
    }

    let query = {
      email: email,
      otp: otp,
      otpExpires: { $gt: Date.now() },
    };

    const user = await User.findOne(query);
    if (!user)
      return ResponseHandler.badRequest(
        response,
        "OTP is invalid or has expired"
      );

    if (type === "reset") {
      return ResponseHandler.ok(response, "Otp verified successfully");
    }

    user.isOtpVerified = true;
    user.otpExpires = null;

    await user.save();
    return ResponseHandler.ok(response, user.toAuthJSON());
  } catch (error) {
    console.log(error, "err");
    return ResponseHandler.badRequest(response, error);
  }
});

router.post("/otp/resend/:email", async (request, response) => {
  const { email } = request.params;

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return ResponseHandler.badRequest(response, "User not found");
    }

    user.setOTP();

    await user.save();
    // sendEmail(user, "Verify OTP", { verifyAccount: true });

    return ResponseHandler.ok(response, "Otp sent successfully");
  } catch (error) {
    return ResponseHandler.badRequest(response, error);
  }
});

router.post("/set-new-password", async (request, response) => {
  try {
    const { email, otp, password } = request.body;
    if (!otp) {
      return ResponseHandler.badRequest(
        response,
        "Otp not found please reset password sagain"
      );
    }
    if (!password || !email?.trim())
      return ResponseHandler.badRequest(
        response,
        "Missing required parameters"
      );

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      authType: "local",
    });
    if (!user) return ResponseHandler.badRequest(response, "User not found!");

    if (user.otp == otp && user.otpExpires > Date.now()) {
      user.setPassword(password);
      user.otp = null;
      user.otpExpires = null;
      await user.save();
      return ResponseHandler.ok(response, "Password reset successfully!");
    } else {
      return ResponseHandler.badRequest(response, "Invalid Token");
    }
  } catch (err) {
    console.log(err, "err");
    return ResponseHandler.badRequest(response, err);
  }
});

module.exports = router;
