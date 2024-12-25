const express = require("express");
const { default: mongoose } = require("mongoose");
const Transaction = require("../../models/Transaction");
const { auth } = require("../../middlewares");
const router = express.Router();

const Budget = mongoose.model("Budget");

// GET all budgets
router.get("/all-budgets",auth.required, auth.user, async (req, res) => {
  const userId = req.user._id; // Extract the user ID from the authenticated request
  const { search, minAmount, maxAmount } = req.query;

  console.log("req query", req.query);

  try {
    // Build the query object dynamically
    const query = { user: userId };

    // Add search filter if provided
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (minAmount && maxAmount) {
      query.limit = {
        $gte: minAmount,
        $lte: maxAmount,
      };
    }
    const budgets = await Budget.find(query);
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// POST add a new budget
router.post("/create", auth.required, auth.user, async (req, res) => {
  const userId= req.user._id

  const { name, limit, emoji, spent } = req.body;
  const newBudget = new Budget({ name, limit, emoji, spent: spent || 0, user: userId});

  try {
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a budget by ID
router.put("/update/:id", auth.required, async (req, res) => {
  const { name, limit, emoji } = req.body;
  try {
    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      { name, limit, emoji },
      { new: true }
    );
    res.json(updatedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a budget by ID
// DELETE a budget by ID and also delete its associated transactions
router.delete("/delete/:id", async (req, res) => {
  try {
    const budgetId = req.params.id;

    // Delete all transactions associated with this budget
    await Transaction.deleteMany({ budget:budgetId });

    // Then, delete the budget
    await Budget.findByIdAndDelete(budgetId);

    res.json({ message: "Budget and its associated transactions deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
