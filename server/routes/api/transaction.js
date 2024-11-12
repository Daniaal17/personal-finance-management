const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
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

// POST add a new transaction
router.post("/create", async (req, res) => {
  const { name, amount, date, budget } = req.body;

  const newTransaction = new Transaction({
    name,
    amount,
    date,
    budget,
  });

  try {
    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
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
router.put("/update/:id", async (req, res) => {
  const { name, amount, date, budget } = req.body;

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { name, amount, date, budget },
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

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
