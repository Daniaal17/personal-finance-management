const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const { auth } = require("../../middlewares");
const {
  ResponseHandler,
  imageUploader,
  schemaValidator,
} = require("../../utils");
const Transaction = require("../../models/Transaction");
const Income = require("../../models/Income");
const router = express.Router();
const imgUpload = imageUploader.fields([{ name: "profileImage", maxCount: 1 }]);

router.get("/context", (request, response) => {
  return ResponseHandler.ok(
    response,
    "User context retrieved successfully...!"
  );
});

router.put(
  "/update",
  auth.required,
  auth.user,
  imgUpload, // Middleware for handling image upload
  async (request, response) => {
    try {
      console.log("body for update", request.body);
      const { fullName, currency } = request.body;
      const userId = request.user._id;
      const parsedCurrency = JSON.parse(currency); // This will convert the stringified object back to an object


      // Handle profile image update
      let profileImage = null;

      if (request.files && request.files.profileImage) {
        const courseImagePath = request.files.profileImage[0].filename;
        profileImage = `http://localhost:8000/uploads/${courseImagePath}`;

       
      }

      // Find the user
      const user = await User.findOne({ _id: userId });
      if (!user) {
        return ResponseHandler.badRequest(response, "User not found");
      }

      // Update user data
      user.profileImage = profileImage || user.profileImage;
      user.fullName = fullName || user.fullName;
      user.currency = parsedCurrency || user.currency;

      // Save the updated user information
      const updatedUser = await user.save();

      // Respond with the updated user data
      return ResponseHandler.ok(response, updatedUser, "User updated successfully!");
    } catch (err) {
      console.log("Error: ", err);
      return ResponseHandler.badRequest(response, err.message || "Error updating user profile");
    }
  }
);

// Update user password
router.put(
  "/update-password",
  auth.required,
  auth.user,
  async (request, response) => {
    try {
      const { currentPassword, newPassword } = request.body;

      if (!currentPassword || !newPassword) {
        return ResponseHandler.badRequest(
          response,
          "Missing required parameters: currentPassword, newPassword"
        );
      }

      if (currentPassword.length <= 0 || newPassword.length <= 0) {
        return ResponseHandler.badRequest(
          response,
          "Passwords cannot be empty"
        );
      }

      if (currentPassword === newPassword) {
        return ResponseHandler.badRequest(
          response,
          "Old password and new password cannot be the same"
        );
      }

      const user = request.user;

      // Check if old password is valid
      if (!user.validPassword(currentPassword)) {
        return ResponseHandler.badRequest(response, "Invalid old password");
      }

      // Set new password
      user.setPassword(newPassword);
      await user.save();

      return ResponseHandler.ok(response, {
        message: "Password has been changed successfully",
      });
    } catch (error) {
      console.log("Error:", error);
      return ResponseHandler.badRequest(
        response,
        error.message || "Error changing password"
      );
    }
  }
);


// Add this to your routes file
router.get("/dashboard-stats", auth.required, auth.user, async (req, res) => {
  const userId = req.user._id;
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Monthly Transactions
    const monthlyTransactions = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, totalAmount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

    // Category-wise Expenses
    const expensesByCategory = await Transaction.aggregate([
      { $match: { user: userId, budget: { $exists: true, $ne: null } } },
      {
        $lookup: {
          from: "budgets",
          localField: "budget",
          foreignField: "_id",
          as: "budgetInfo",
        },
      },
      { $unwind: "$budgetInfo" },
      { $group: { _id: "$budgetInfo.name", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    // Income vs Expenses
    const expensesData = await Transaction.aggregate([
      { $match: { user: userId } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, expenses: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

    const incomeData = await Income.aggregate([
      { $match: { user: userId } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, income: { $sum: "$amount" } } },
      { $sort: { _id: 1 } }
    ]);

    // Merge income and expenses data
    const allMonths = new Set([...expensesData.map(e => e._id), ...incomeData.map(i => i._id)]);
    const monthlyComparison = Array.from(allMonths).sort().map(month => ({
      month,
      expenses: expensesData.find(e => e._id === month)?.expenses || 0,
      income: incomeData.find(i => i._id === month)?.income || 0,
    }));

    res.json({
      dailySpending: monthlyTransactions,
      expensesByCategory,
      monthlyComparison,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
