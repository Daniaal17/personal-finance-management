const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  limit: { type: Number, required: true },
  emoji: { type: String },
  spent: { type: Number, default: 0 },
});

module.exports = mongoose.model("Budget", BudgetSchema);
