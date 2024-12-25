import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
  confirmationAlert,
  failureToaster,
  successToaster,
} from "../../../utils/swal";
import axios from "axios";
import TransactionsFilter from "./TransactionsFilter";
import TransactionsList from "./TransactionsList";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ search: "", startDate: null, endDate: null });
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

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/transactions/all-transactions", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        params: filters,
      });

      if (response.status !== 200) throw new Error("Failed to fetch transactions");
      setTransactions(response.data);
    } catch (error) {
      setError("Error fetching transactions");
    }
  };

  const fetchBudgets = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:8000/api/budget/all-budgets", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      setBudgets(response.data);
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
    const token = localStorage.getItem("token");

    const payload = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      budget: formData.budgetId,
      date: formData.date,
    };

    const url = editingTransaction
      ? `http://localhost:8000/api/transactions/update/${editingTransaction._id}`
      : "http://localhost:8000/api/transactions/create";

    try {
      const response = await axios({
        method: editingTransaction ? "put" : "post",
        url: url,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: payload,
      });

      if (response.data) {
        setIsOffcanvasOpen(false);
        setFormData({ amount: "", name: "", budgetId: "", date: "" });
        fetchTransactions();
        successToaster(
          editingTransaction
            ? "Transaction updated successfully"
            : "Transaction added successfully"
        );
      }
    } catch (error) {
      setError(error.message);
      failureToaster("Failed to save transaction");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/transactions/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response) throw new Error("Failed to delete transaction");
      fetchTransactions();
      successToaster("Transaction deleted successfully");
    } catch (error) {
      setError("Error deleting transaction");
      failureToaster("Failed to delete transaction");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-6xl mx-auto">
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

        <div className="my-5">
          <TransactionsFilter onFilterChange={handleFilterChange} filters={filters} />
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <TransactionsList
          transactions={transactions}
          budgets={budgets}
          onEdit={handleOpenOffcanvas}
          onDelete={handleDelete}
        />

        {/* Offcanvas/Slide-over Form */}
        {isOffcanvasOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50">
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                    </h2>
                    <button
                      onClick={() => setIsOffcanvasOpen(false)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 p-6 overflow-y-auto space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Please enter name of the transaction"
                      name="name"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      placeholder="Please enter amount for transaction"
                      name="amount"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Budget
                    </label>
                    <select
                      name="budgetId"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      value={formData.budgetId}
                      onChange={(e) =>
                        setFormData({ ...formData, budgetId: e.target.value })
                      }
                      required
                    >
                      <option value="">Select Budget</option>
                      {budgets.map((budget) => (
                        <option key={budget._id} value={budget._id}>
                          {budget.emoji} {budget.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-center"
                  >
                    {editingTransaction ? "Save Changes" : "Add Transaction"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;