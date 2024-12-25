import React, { useState } from "react";
import EmojiPicker from "../../../components/EmojiPicker";
import axios from "axios";
import { successToaster, failureToaster } from "../../../utils/swal";

const AddBudgetModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ name: "", limit: "" });
  const [selectedEmoji, setSelectedEmoji] = useState("💰");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const token = localStorage.getItem("token"); //get the token which has been set at time of login
    if (!formData.name.trim()) {
      setError("Please enter a budget name");
      return;
    }
    if (!formData.limit || isNaN(formData.limit) || Number(formData.limit) <= 0) {
      setError("Please enter a valid budget limit");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/budget/create", {
        name: formData.name.trim(),
        limit: Number(formData.limit),
        emoji: selectedEmoji,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adding the Bearer token
        },
      }
    );

      if (response.data) {
        // On successful creation, pass the new budget back to parent
        onSubmit(response.data);
        successToaster("Budget created successfully");
        setFormData({ name: "", limit: "" });
        setSelectedEmoji("💰");
        setError("");
        onClose();
      }
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Error creating budget");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 relative">
        <h2 className="text-2xl font-bold">Create New Budget</h2>
        <EmojiPicker selectedEmoji={selectedEmoji} onSelect={setSelectedEmoji} />
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Budget Name"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="number"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          placeholder="Budget Limit"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              setError(""); // Clear error on cancel
              onClose();
            }}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
          >
            Add Budget
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBudgetModal;
