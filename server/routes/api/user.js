const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");

const { auth } = require("../../middlewares");
const {
  ResponseHandler,
  imageUploader,
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




router.get("/dashboard-stats", auth.required, auth.user, async (req, res) => {
  const userId = req.user._id;
  try {

    // Last 6 Transactions for Weekly View
    const lastSixTransactions = await Transaction.aggregate([
      { $match: { user: userId } },
      { $sort: { date: -1 } },
      { $limit: 6 },
      {
        $project: {
          _id: 0,
          date: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalAmount: "$amount",
        },
      },
    ]);

    const dailySpending = lastSixTransactions.reverse();

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
      dailySpending,
      expensesByCategory,
      monthlyComparison,
      futureExpenses:[]
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



router.get("/forecast-expenses", auth.required, auth.user, async (req, res) => {
  const userId = req.user._id;

  try {
    // Get transactions from the past year
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Fetch past transaction data for the user
    const transactions = await Transaction.aggregate([
      { $match: { user: userId, date: { $gte: oneYearAgo } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, totalAmount: { $sum: "$amount" } } },
      { $sort: { _id: 1 } },
    ]);

    // Ensure there is at least one month of data
    if (transactions.length < 2) {
      return res.status(400).json({
        message: "Not enough data to calculate forecast. At least two months of data is required.",
      });
    }

    // Calculate month-to-month differences
    const monthlyDifferences = [];
    for (let i = 1; i < transactions.length; i++) {
      const diff = transactions[i].totalAmount - transactions[i - 1].totalAmount;
      monthlyDifferences.push(diff);
    }

    // Calculate the average month-to-month difference
    const averageDifference =
      monthlyDifferences.reduce((sum, diff) => sum + diff, 0) / monthlyDifferences.length;

    // Forecast for the next 6 months
    const forecast = [];
    const now = new Date();
    let lastMonthExpense = transactions[transactions.length - 1].totalAmount; // Start with the last month's expense
    for (let i = 0; i < 6; i++) {
      const forecastedExpense = lastMonthExpense + averageDifference;
      forecast.push({
        month: new Date(now.getFullYear(), now.getMonth() + i + 1, 1)
          .toISOString()
          .split("T")[0]
          .slice(0, 7),
        predictedAmount: forecastedExpense > 0 ? forecastedExpense : 0, // Prevent negative forecast
      });
      lastMonthExpense = forecastedExpense; // Update for the next month's calculation
    }

    res.json({
      forecast,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate forecast", error: error.message });
  }
});








module.exports = router;
