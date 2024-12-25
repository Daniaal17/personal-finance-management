import React, { useState, useEffect } from "react";
import { Plus, X, Edit, Trash2, DollarSign } from "lucide-react";
import {
  confirmationAlert,
  failureToaster,
  successToaster,
} from "../../../utils/swal";
import axios from "axios";

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    allocatedToRetirement: "",
    date: new Date().toISOString().split("T")[0],
  });

  const preferredCurrency = JSON.parse(localStorage.getItem("user"))?.currency;


  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/income/all-incomes", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Token for authentication
        },
      });
  
      setIncomes(response.data);
    } catch (error) {
      setError("Error fetching incomes");
      failureToaster("Failed to fetch incomes");
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationError = validateRetirementAllocation(
      formData.amount,
      formData.allocatedToRetirement
    );
    if (validationError) {
      setError(validationError);
      failureToaster(validationError);
      return;
    }
  
    const url = editingIncome
      ? `http://localhost:8000/api/income/update/${editingIncome._id}`
      : "http://localhost:8000/api/income/create";
  
    try {
      const response = await axios({
        method: editingIncome ? "PUT" : "POST",
        url,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Token for authentication
        },
        data: {
          source: formData.source,
          amount: parseFloat(formData.amount),
          allocatedToRetirement: parseFloat(formData.allocatedToRetirement) || 0,
          date: formData.date,
        },
      });
  
      setIsOffcanvasOpen(false);
      setFormData({
        source: "",
        amount: "",
        allocatedToRetirement: "",
        date: "",
      });
      fetchIncomes();
      successToaster(
        editingIncome
          ? "Income updated successfully"
          : "Income added successfully"
      );
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save income");
      failureToaster("Failed to save income");
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/income/delete/${id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`, // Token for authentication
        },
      });
  
      fetchIncomes();
      successToaster("Income deleted successfully");
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting income");
      failureToaster("Failed to delete income");
    }
  };
  
  const handleOpenOffcanvas = (income = null) => {
    if (income) {
      setFormData({
        source: income.source,
        amount: income.amount,
        allocatedToRetirement: income.allocatedToRetirement,
        date: income.date.split("T")[0],
      });
      setEditingIncome(income);
    } else {
      setFormData({
        source: "",
        amount: "",
        allocatedToRetirement: "",
        date: new Date().toISOString().split("T")[0],
      });
      setEditingIncome(null);
    }
    setIsOffcanvasOpen(true);
    setError("");
  };

  const validateRetirementAllocation = (amount, retirement) => {
    const amountNum = parseFloat(amount);
    const retirementNum = parseFloat(retirement);
    if (retirementNum > amountNum) {
      return "Retirement allocation cannot exceed income amount";
    }
    return null;
  };

  

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Income</h1>
            <p className="text-gray-500">
              Track your income and retirement savings
            </p>
          </div>
          <button
            onClick={() => handleOpenOffcanvas()}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Income</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* Income List */}
        <div className="bg-white rounded-2xl shadow-sm">
          {incomes.map((income) => (
            <div
              key={income._id}
              className="p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {income.source}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(income.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="font-semibold text-green-500">
                      +{preferredCurrency?.symbol}{Number(income.amount).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Retirement: {preferredCurrency?.symbol}
                      {Number(income.allocatedToRetirement).toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center ">
                    <button
                      onClick={() => handleOpenOffcanvas(income)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <Edit  size={20}/>
                    </button>
                    <button
                      onClick={() =>
                        confirmationAlert(() => handleDelete(income._id))
                      }
                      className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2  size={20}/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {incomes.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">
                No income recorded yet
              </h3>
              <p className="text-gray-500">
                Start by adding your first income entry
              </p>
            </div>
          )}
        </div>

        {/* Offcanvas/Slide-over */}
        {isOffcanvasOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40">
            <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-lg z-50">
              <div className="h-full flex flex-col">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {editingIncome ? "Edit Income" : "Add Income"}
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
                  {/* Source */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Source
                    </label>
                    <input
                      type="text"
                      name="source"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                      value={formData.source}
                      onChange={(e) =>
                        setFormData({ ...formData, source: e.target.value })
                      }
                      required
                      placeholder="e.g., Salary, Freelance, Investment"
                    />
                  </div>
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                      value={formData.amount}
                      onChange={(e) => {
                        setFormData({ ...formData, amount: e.target.value });
                        // Reset retirement allocation if it exceeds the new amount
                        if (
                          parseFloat(formData.allocatedToRetirement) >
                          parseFloat(e.target.value)
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            allocatedToRetirement: "",
                          }));
                        }
                      }}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </div>
                  {/* Retirement Allocation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Retirement Allocation
                    </label>
                    <input
                      type="number"
                      name="allocatedToRetirement"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                      value={formData.allocatedToRetirement}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          allocatedToRetirement: e.target.value,
                        })
                      }
                      min="0"
                      max={formData.amount}
                      step="0.01"
                      placeholder={`Max: ${formData.amount || "0.00"}`}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Cannot exceed income amount of {preferredCurrency?.symbol}
                      {formData.amount || "0.00"}
                    </p>
                  </div>
                  {/* Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    {editingIncome ? "Save Changes" : "Add Income"}
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

export default Income;
