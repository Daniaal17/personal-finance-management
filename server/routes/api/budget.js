const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

const Budget = mongoose.model("Budget");

// GET all budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find();
    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add a new budget
router.post("/create", async (req, res) => {
  const { name, limit, emoji, spent } = req.body;
  const newBudget = new Budget({ name, limit, emoji, spent: spent || 0 });

  try {
    const savedBudget = await newBudget.save();
    res.status(201).json(savedBudget);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update a budget by ID
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
  try {
    await Budget.findByIdAndDelete(req.params.id);
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
