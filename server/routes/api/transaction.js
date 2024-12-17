const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Budget = require("../../models/Budget");
const Transaction = mongoose.model("Transaction"); // Assuming the model is already registered with mongoose

// GET all transactions
router.get("/all-transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("budget"); // Populate budget details if needed
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST route for creating a transaction
router.post("/create", async (req, res) => {
  const { name, amount, date, budget: budgetId } = req.body;

  const newTransaction = new Transaction({
    name,
    amount,
    date,
    budget: budgetId,
  });

  try {
    const savedTransaction = await newTransaction.save();

    // Update the spent amount in the associated budget
    const budget = await Budget.findById(budgetId);
    if (budget) {
      budget.spent += amount;
      await budget.save();
    }

    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT route for updating a transaction
router.put("/update/:id", async (req, res) => {
  const { name, amount, date, budget: budgetId } = req.body;

  try {
    const existingTransaction = await Transaction.findById(req.params.id);
    if (!existingTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Calculate the difference between new and old amounts
    const amountDifference = amount - existingTransaction.amount;

    // Update the transaction with new details
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { name, amount, date, budget: budgetId },
      { new: true }
    );

    // Update the spent amount in the associated budget
    const budget = await Budget.findById(budgetId);
    if (budget) {
      budget.spent += amountDifference;
      await budget.save();
    }

    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET a single transaction by ID
router.get("/transaction/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).populate(
      "budget"
    ); // Populate budget if needed
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update a transaction by ID

// DELETE a transaction by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
