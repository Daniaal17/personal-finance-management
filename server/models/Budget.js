const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  limit: { type: Number, required: true },
  emoji: { type: String },
  spent: { type: Number, default: 0 },
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
});

module.exports = mongoose.model("Budget", BudgetSchema);
