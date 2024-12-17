const mongoose = require("mongoose");

const IncomeSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    allocatedToRetirement: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Income", IncomeSchema);
