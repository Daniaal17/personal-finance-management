import React, { useEffect, useState } from "react";
import { Plus, X, Edit, LucideDelete } from "lucide-react";
import axios from "axios";
import { failureToaster, successToaster } from "../../../utils/swal";

const EMOJI_CATEGORIES = {
  recent: ["🛒", "🏠", "🚗", "🌳", "📱", "🎮", "💰", "🍔", "✈️", "👕"],
  money: ["💰", "💵", "💸", "🏦", "💳", "💎", "🤑", "💹", "📈", "🏧"],
  shopping: ["🛒", "🛍️", "👕", "👗", "👟", "💄", "🎽", "👜", "🕶️", "⌚"],
  travel: ["✈️", "🚗", "🚕", "🚄", "🚲", "⛴️", "🚅", "🚝", "🚠", "🚁"],
  food: ["🍔", "🍕", "🍜", "🍱", "🍳", "🥗", "🍖", "🥪", "🥤", "🍺"],
  home: ["🏠", "🛋️", "🛁", "🚿", "🛏️", "🪴", "🧺", "🧹", "💡", "🪑"],
};

const Budget = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("💰");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ name: "", limit: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/budget/all-budgets"
        );
        setBudgets(response.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };

    fetchBudgets();
  }, []);

  const handleOpenModal = (budget = null) => {
    if (budget) {
      setFormData({ name: budget.name, limit: budget.limit });
      setSelectedEmoji(budget.emoji);
      setEditingBudget(budget);
    } else {
      setFormData({ name: "", limit: "" });
      setSelectedEmoji("💰");
      setEditingBudget(null);
    }
    setIsModalOpen(true);
    setError("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowEmojiPicker(false);
    setError("");
    setFormData({ name: "", limit: "" });
    setEditingBudget(null);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError("Please enter a budget name");
      return;
    }
    if (
      !formData.limit ||
      isNaN(formData.limit) ||
      Number(formData.limit) <= 0
    ) {
      setError("Please enter a valid budget limit");
      return;
    }

    const budgetData = {
      name: formData.name,
      limit: Number(formData.limit),
      emoji: selectedEmoji,
    };

    try {
      if (editingBudget) {
        console.log("Edit budget", editingBudget);
        await axios.put(
          `http://localhost:8000/api/budget/update/${editingBudget._id}`,
          budgetData
        );
        successToaster("Budget updated successfully");
        setBudgets(
          budgets.map((budget) =>
            budget._id === editingBudget._id
              ? { ...budget, ...budgetData }
              : budget
          )
        );
      } else {
        const response = await axios.post(
          "http://localhost:8000/api/budget/create",
          budgetData
        );
        successToaster("Budget created successfully");
        setBudgets([...budgets, response.data]);
      }
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Error saving budget");
    }

    handleCloseModal();
  };

  const handleDelete = async (budgetId) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await axios.delete(
          `http://localhost:8000/api/budget/delete/${budgetId}`
        );
        successToaster("Budget deleted successfully");
        setBudgets(budgets.filter((budget) => budget._id !== budgetId));
      } catch (error) {
        failureToaster(
          error?.response?.data?.message || "Error deleting budget"
        );
      }
    }
  };

  const calculateProgress = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Budget grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Budget Card */}
          <div
            onClick={() => handleOpenModal()}
            className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-gray-600 font-medium">Create New Budget</p>
          </div>

          {/* Budget Cards */}
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{budget.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {budget.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleOpenModal(budget)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="h-5 w-5 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <LucideDelete className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-purple-500 transition-all"
                  style={{
                    width: `${calculateProgress(budget.spent, budget.limit)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {editingBudget ? "Edit Budget" : "Create New Budget"}
                </h2>
                <p className="text-gray-500">
                  Set up your budget with a name, limit, and emoji
                </p>
              </div>
              <div className="space-y-4">
                {/* Emoji Selector with Scrollable Dropdown */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Choose an Emoji
                  </label>
                  <div
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all"
                  >
                    <span className="text-2xl">{selectedEmoji}</span>
                  </div>

                  {showEmojiPicker && (
                    <div className="absolute top-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-72 max-h-64 overflow-hidden z-10">
                      <div className="h-full overflow-y-auto pr-2 space-y-4">
                        {Object.entries(EMOJI_CATEGORIES).map(
                          ([category, emojis]) => (
                            <div key={category} className="pb-4">
                              <h3 className="text-sm font-medium text-gray-700 mb-2 sticky top-0 bg-white capitalize">
                                {category}
                              </h3>
                              <div className="grid grid-cols-5 gap-2">
                                {emojis.map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={() => {
                                      setSelectedEmoji(emoji);
                                      setShowEmojiPicker(false);
                                    }}
                                    className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-xl"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Budget Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter budget name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Budget Limit Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget Limit
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={formData.limit}
                      onChange={(e) =>
                        setFormData({ ...formData, limit: e.target.value })
                      }
                      placeholder="0.00"
                      className="w-full px-4 py-2 pl-8 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      min="0"
                    />
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors focus:outline-none"
                  >
                    {editingBudget ? "Save Changes" : "Create Budget"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;
