const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares");

const Income = require("../../models/Income");

// GET all incomes
router.get("/all-incomes", auth.required, auth.user, async (req, res) => {
  const userId =req.user._id
  try {
    const incomes = await Income.find({user: userId}).sort({ date: -1 });
    res.json(incomes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new income
router.post("/create", auth.required, auth.user, async (req, res) => {
  const userId =req.user._id
  const { source, amount, date, allocatedToRetirement } = req.body;

  // Validate retirement allocation
  if (allocatedToRetirement > amount) {
    return res.status(400).json({
      message: "Retirement allocation cannot exceed income amount",
    });
  }

  const newIncome = new Income({
    source,
    amount,
    date,
    allocatedToRetirement: allocatedToRetirement || 0,
    user: userId
  });

  try {
    const savedIncome = await newIncome.save();
    res.status(201).json(savedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// PUT update income
router.put("/update/:id", async (req, res) => {

  const { source, amount, date, allocatedToRetirement } = req.body;

  // Validate retirement allocation
  if (allocatedToRetirement > amount) {
    return res.status(400).json({
      message: "Retirement allocation cannot exceed income amount",
    });
  }

  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      {
        source,
        amount,
        date,
        allocatedToRetirement: allocatedToRetirement || 0,
      },
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json(updatedIncome);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE income
router.delete("/delete/:id", auth.required, async (req, res) => {
  try {
    const deletedIncome = await Income.findByIdAndDelete(req.params.id);

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET total income and retirement statistics
router.get("/statistics", auth.required, async (req, res) => {
  try {
    const result = await Income.aggregate([
      {
        $group: {
          _id: null,
          totalIncome: { $sum: "$amount" },
          totalRetirementAllocation: { $sum: "$allocatedToRetirement" },
          averageIncome: { $avg: "$amount" },
          averageRetirementAllocation: { $avg: "$allocatedToRetirement" },
        },
      },
    ]);

    const stats = result[0] || {
      totalIncome: 0,
      totalRetirementAllocation: 0,
      averageIncome: 0,
      averageRetirementAllocation: 0,
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET monthly income summary
router.get("/monthly-summary", async (req, res) => {
  try {
    const monthlySummary = await Income.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          totalIncome: { $sum: "$amount" },
          totalRetirement: { $sum: "$allocatedToRetirement" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": -1,
          "_id.month": -1,
        },
      },
    ]);

    res.json(monthlySummary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
