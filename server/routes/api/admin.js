const express = require("express");
const mongoose = require("mongoose");
const { ResponseHandler, schemaValidator } = require("../../utils");
const router = express.Router();
const User = mongoose.model("User");

router.post("/create/user", async (request, response) => {
  try {
    const { fullName, email, phone, role } = request.body;
    const errors = schemaValidator(request.body, {
      email: "string",
      fullName: "string",
      phone: "string",
      role: "string",
    });
    if (errors.length)
      return ResponseHandler.badRequest(response, errors.join(", "));

    const exsUser = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    if (exsUser)
      return ResponseHandler.badRequest(response, "User already exists");

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

router.get("/users", async (request, response) => {
  try {
    const { page = 1, limit = 10, search = "" } = request.query;

    console.log("Query", request.query);

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    let queryCondition = {};
    if (search) {
      queryCondition.name = { $regex: new RegExp(search, "i") };
    }

    const users = await User.find(queryCondition)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalCount = await User.countDocuments(queryCondition);

    const paginationInfo = {
      totalItems: totalCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCount / pageSize),
      pageSize: pageSize,
    };

    return ResponseHandler.ok(response, {
      users: users,
      pagination: paginationInfo,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return ResponseHandler.badRequest(
      response,
      error.message || "Error processing your request"
    );
  }
});

router.put("/update/user-status/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    console.log("User id", userId);
    const { status } = request.body;
    console.log("Status", status);

    const user = await User.findOne({ _id: userId });

    if (!user) return ResponseHandler.badRequest(response, "User not found");

    user.status = status;
    await user.save();

    return ResponseHandler.ok(response, "Status updated successfully");
  } catch (err) {
    console.log(err, "error");
    return ResponseHandler.badRequest(response, err);
  }
});

router.put("/update/user/:userId", async (request, response) => {
  try {
    const { userId } = request.params;

    const { status, role, fullName, phone } = request.body;
    console.log("Status", status);

    const user = await User.findOne({ _id: userId });

    if (!user) return ResponseHandler.badRequest(response, "User not found");

    user.status = status || user.status;
    user.role = role || user.role;
    user.fullName = fullName || user.fullName;
    user.phone = phone || user.phone;

    await user.save();

    return ResponseHandler.ok(response, "Status updated successfully");
  } catch (err) {
    console.log(err, "error");
    return ResponseHandler.badRequest(response, err);
  }
});
module.exports = router;
