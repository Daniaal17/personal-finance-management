const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Budget = require("../../models/Budget");
const { auth } = require("../../middlewares");

const { sendEmail, sendNotification } = require("../../utils");
const Transaction = mongoose.model("Transaction"); // Assuming the model is already registered with mongoose

// GET all transactions
router.get("/all-transactions", auth.required, auth.user, async (req, res) => {
  const userId = req.user._id; // Extract the user ID from the authenticated request
  const { search, startDate, endDate } = req.query;

  try {
    // Build the query object dynamically
    const query = { user: userId };

    // Add search filter if provided
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Add date range filter if both dates are provided
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } else if (startDate) {
      query.date = { $gte: new Date(startDate) }; // Filter from startDate onwards
    } else if (endDate) {
      query.date = { $lte: new Date(endDate) }; // Filter up to endDate
    }

    // Fetch the filtered transactions from the database
    const transactions = await Transaction.find(query).populate("budget");

    // Return the transactions as a JSON response
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching filtered transactions:", err);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});


// POST route for creating a transaction
router.post("/create", auth.required, auth.user, async (req, res) => {
  const userId = req.user._id;
  const { name, amount, date, budget: budgetId } = req.body;

  const newTransaction = new Transaction({
    name,
    amount,
    date,
    budget: budgetId,
    user: userId
  });

  try {
    const savedTransaction = await newTransaction.save();

    // Update the spent amount in the associated budget
    const budget = await Budget.findById(budgetId);
    if (budget) {
      // Update the budget's spent amount
      budget.spent += amount;
      await budget.save();

      // Calculate the new spent percentage
      const spentPercentage = (budget.spent / budget.limit) * 100;

      // Send notifications based on thresholds crossed
      if (spentPercentage >= 50 && spentPercentage < 80) {
        const text = `You've used 50% of your budget "${budget.name}".`;
        const description = `You've spent $${budget.spent} out of $${budget.limit}. Be cautious about further spending.`;
        sendNotification(text, description, req.user._id);
      }

      if (spentPercentage >= 80 && spentPercentage < 100) {
        const text = `You've used 80% of your budget "${budget.name}".`;
        const description = `You've spent $${budget.spent} out of $${budget.limit}. Be cautious about further spending.`;
        sendNotification(text, description, req.user._id);
      }

      if (spentPercentage >= 100) {
        const text = `You've used 100% of your budget "${budget.name}".`;
        const description = `You've spent $${budget.spent} out of $${budget.limit}. You've reached your budget limit.`;
        sendNotification(text, description, req.user._id);
      }
    }

    res.status(201).json(savedTransaction);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// PUT update a transaction by ID
router.put("/update/:id", auth.required, auth.user, async (req, res) => {
  const { name, amount, date, budget: newBudgetId } = req.body;

  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const oldAmount = transaction.amount;
    const oldBudgetId = transaction.budget;

    // Update the transaction fields
    transaction.name = name || transaction.name;
    transaction.amount = amount || transaction.amount;
    transaction.date = date || transaction.date;
    transaction.budget = newBudgetId || transaction.budget;

    // Save the updated transaction
    const updatedTransaction = await transaction.save();

    // Update the old budget if the budget has changed
    if (newBudgetId && oldBudgetId.toString() !== newBudgetId.toString()) {
      const oldBudget = await Budget.findById(oldBudgetId);
      const newBudget = await Budget.findById(newBudgetId);

      if (oldBudget) {
        oldBudget.spent -= oldAmount;
        if (oldBudget.spent < 0) oldBudget.spent = 0;
        await oldBudget.save();
      }

      if (newBudget) {
        newBudget.spent += amount;
        await newBudget.save();

        // Calculate the new spent percentage
        const spentPercentage = (newBudget.spent / newBudget.limit) * 100;

        // Send notifications based on thresholds
        if (spentPercentage >= 50 && spentPercentage < 80) {
          const text = `You've used 50% of your budget "${newBudget.name}".`;
          const description = `You've spent $${newBudget.spent} out of $${newBudget.limit}. Be cautious about further spending.`;
          sendNotification(text, description, req.user._id);
        }

        if (spentPercentage >= 80 && spentPercentage < 100) {
          const text = `You've used 80% of your budget "${newBudget.name}".`;
          const description = `You've spent $${newBudget.spent} out of $${newBudget.limit}. Be cautious about further spending.`;
          sendNotification(text, description, req.user._id);
        }

        if (spentPercentage >= 100) {
          const text = `You've used 100% of your budget "${newBudget.name}".`;
          const description = `You've spent $${newBudget.spent} out of $${newBudget.limit}. You've reached your budget limit.`;
          sendNotification(text, description, req.user._id);
        }
      }
    } else {
      // If the budget hasn't changed, update the existing budget's spent value
      const budget = await Budget.findById(oldBudgetId);
      if (budget) {
        budget.spent = budget.spent - oldAmount + amount;
        if (budget.spent < 0) budget.spent = 0;
        await budget.save();

        // Calculate the new spent percentage
        const spentPercentage = (budget.spent / budget.limit) * 100;

        // Send notifications based on thresholds
        if (spentPercentage >= 50 && spentPercentage < 80) {
          const text = `You've used 50% of your budget "${budget.name}".`;
          const description = `You've spent $${budget.spent} out of $${budget.limit}. Be cautious about further spending.`;
          sendNotification(text, description, req.user._id);
        }

        if (spentPercentage >= 80 && spentPercentage < 100) {
          const text = `You've used 80% of your budget "${budget.name}".`;
          const description = `You've spent $${budget.spent} out of $${budget.limit}. Be cautious about further spending.`;
          sendNotification(text, description, req.user._id);
        }

        if (spentPercentage >= 100) {
          const text = `You've used 100% of your budget "${budget.name}".`;
          const description = `You've spent $${budget.spent} out of $${budget.limit}. You've reached your budget limit.`;
          sendNotification(text, description, req.user._id);
        }
      }
    }

    res.status(200).json({ message: "Transaction updated successfully", transaction: updatedTransaction });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});



// DELETE a transaction by ID
router.delete("/delete/:id", auth.required, auth.user, async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);
   

    const budget = await Budget.findById(transaction.budget);
    if (budget) {
      // Deduct the transaction amount from the budget's spent field
      budget.spent -= transaction.amount;
      if (budget.spent < 0) budget.spent = 0; // Prevent negative spent values
      await budget.save();
    }


    return res.status(200).json({ message: "Transaction deleted successfully and budget updated" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error", error: err.message });
  }
});

module.exports = router;
