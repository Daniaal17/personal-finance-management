const passport = require("passport");
const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const { auth } = require("../../middlewares");
const {
  ResponseHandler,
  sendEmail,
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
  const { name, email, password, currency } = request.body; // received the data from frontend and destructured the data comes in the body
  try {
   if(!name ||  !email || !password || !currency) {
    return ResponseHandler.badRequest(response, "All fields are required"); // if any of field is missing it will through error
   }
      // finding the coming email from the database as unique 
    const exsUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (exsUser)
      return ResponseHandler.badRequest(response, "User already exists"); // if email found means that user is already in the database so it will throw an error

    // if user is not in the database then create a new user
    let user = new User({
      fullName: name,
      email: email.trim().toLowerCase(),
      currency: currency,
    });

    // set their password through the set password method which i have written in schema
    user.setPassword(password);
        
    user.setOTP();// set their otp using method which i have written in schema

    await user.save();// now in this step it will register the user  will all information which we have created
    sendEmail(user, "Verify OTP", { verifyAccount: true }); // i have created a utility for sending email to the user for otp verification
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

    if(!email || !password) { 
      return ResponseHandler.badRequest(response, "Email and password is required");
    
    }

   

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

    return ResponseHandler.ok(response,   user.toAuthJSON() );
  } catch (err) {
    console.log(err, "error");
    return ResponseHandler.badRequest(response, err);
  }
});

router.post("/otp/verify/:email/:type", async (request, response) => {
  // Extract OTP from request body
  const { otp } = request.body;
  
  // Extract email and verification type from URL parameters
  // type can be either 'verification' (for signup) or 'reset' (for password reset)
  const { email, type } = request.params;

  try {
      // Validate if OTP is provided in request
      if (!otp) {
          return ResponseHandler.badRequest(
              response,
              "Missing required parameters"
          );
      }

      // Construct query to find user with matching email, OTP, and non-expired OTP
      const query = {
          email: email,
          otp: otp,
          otpExpires: { $gt: Date.now() }, // Check if OTP hasn't expired
      };

      // Find user matching the query criteria
      const user = await User.findOne(query);
      
      // If no user found or OTP expired, return error
      if (!user) {
          return ResponseHandler.badRequest(
              response,
              "OTP is invalid or has expired"
          );
      }

      // Handle password reset verification
      if (type === "reset") {
          return ResponseHandler.ok(response, "Otp verified successfully");
      }

      // For signup verification:
      // Update user verification status
      user.isOtpVerified = true;
      user.otpExpires = null;  // Clear OTP expiry after successful verification

      // Save updated user data
      await user.save();
      
      // Return user data in authentication format
      return ResponseHandler.ok(response, user.toAuthJSON());

  } catch (error) {
      // Log any errors during execution
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
    sendEmail(user, "Verify OTP", { verifyAccount: true });

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
