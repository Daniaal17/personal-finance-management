import React, { useState, useEffect } from "react";
import { Plus, X, Edit, Trash2, DollarSign } from "lucide-react";
import { failureToaster, successToaster } from "../../../utils/swal";
// import { message } from "antd"; // Optional: For user notifications

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    budgetId: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Fetch transactions and budgets on component mount
  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/transactions/all-transactions"
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      setError("Error fetching transactions");
    }
  };

  const fetchBudgets = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/budget/all-budgets"
      );
      if (!response.ok) throw new Error("Failed to fetch budgets");
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      setError("Error fetching budgets");
    }
  };

  const handleOpenOffcanvas = (transaction = null) => {
    if (transaction) {
      setFormData({
        amount: transaction.amount,
        name: transaction.name,
        budgetId: transaction.budget,
        date: transaction.date.split("T")[0],
      });
      setEditingTransaction(transaction);
    } else {
      setFormData({
        amount: "",
        name: "",
        budgetId: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingTransaction(null);
    }
    setIsOffcanvasOpen(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingTransaction
      ? `http://localhost:8000/api/transactions/update/${editingTransaction._id}`
      : "http://localhost:8000/api/transactions/create";

    try {
      const response = await fetch(url, {
        method: editingTransaction ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          amount: parseFloat(formData.amount),
          budget: formData.budgetId,
          date: formData.date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error saving transaction");
      }

      setIsOffcanvasOpen(false);
      setFormData({ amount: "", name: "", budgetId: "", date: "" });
      fetchTransactions();
      successToaster(
        editingTransaction
          ? "Transaction updated successfully"
          : "Transaction added successfully"
      );
    } catch (error) {
      setError(error.message);
      failureToaster("Failed to save transaction");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/transactions/delete/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete transaction");
        fetchTransactions();
        successToaster("Transaction deleted successfully");
      } catch (error) {
        setError("Error deleting transaction");
        failureToaster("Failed to delete transaction");
      }
    }
  };

  const getBudgetName = (budgetId) => {
    const budget = budgets.find((b) => b._id === budgetId);
    return budget ? budget.name : "Unknown Budget";
  };

  const getBudgetEmoji = (budgetId) => {
    const budget = budgets.find((b) => b._id === budgetId);
    return budget ? budget.emoji : "💰";
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-500">Manage your expenses and income</p>
          </div>
          <button
            onClick={() => handleOpenOffcanvas()}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Transaction</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-2xl shadow-sm">
          {transactions.map((transaction) => (
            <div
              key={transaction._id}
              className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-xl">
                      {getBudgetEmoji(transaction.budget)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {transaction.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getBudgetName(transaction.budget)} •{" "}
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`font-semibold ${
                      Number(transaction.amount) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {Number(transaction.amount) >= 0 ? "+" : ""}
                    {Number(transaction.amount).toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenOffcanvas(transaction)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction._id)}
                      className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {transactions.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">
                No transactions yet
              </h3>
              <p className="text-gray-500">
                Start by adding your first transaction
              </p>
            </div>
          )}
        </div>

        {/* Offcanvas/Slide-over */}
        {isOffcanvasOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50 transform transition-transform duration-300">
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {editingTransaction
                        ? "Edit Transaction"
                        : "Add Transaction"}
                    </h2>
                    <button
                      onClick={() => setIsOffcanvasOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transaction Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter transaction name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={formData.amount}
                          onChange={(e) =>
                            setFormData({ ...formData, amount: e.target.value })
                          }
                          className="w-full px-4 py-2 pl-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="0.00"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Budget Category
                      </label>
                      <select
                        value={formData.budgetId}
                        onChange={(e) =>
                          setFormData({ ...formData, budgetId: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select a budget</option>
                        {budgets.map((budget) => (
                          <option key={budget._id} value={budget._id}>
                            {budget.emoji} {budget.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setIsOffcanvasOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                    >
                      {editingTransaction ? "Save Changes" : "Add Transaction"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
