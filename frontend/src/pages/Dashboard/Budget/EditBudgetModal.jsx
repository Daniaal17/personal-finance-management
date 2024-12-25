import React, { useState } from "react";
import EmojiPicker from "../../../components/EmojiPicker";
import axios from "axios";
import { successToaster, failureToaster } from "../../../utils/swal";

const EditBudgetModal = ({ isOpen, onClose, budget, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: budget.name,
    limit: budget.limit,
  });
  const [selectedEmoji, setSelectedEmoji] = useState(budget.emoji);
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
      const response = await axios.put(`http://localhost:8000/api/budget/update/${budget._id}`, {
        name: formData.name,
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
      
        onSubmit(response.data);
        successToaster("Budget updated successfully");
        onClose();
      }
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Error updating budget");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg space-y-4 relative">
        <h2 className="text-2xl font-bold">Edit Budget</h2>
        <EmojiPicker selectedEmoji={selectedEmoji} onSelect={setSelectedEmoji} />
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Budget Name"
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="number"
          value={formData.limit}
          onChange={(e) => setFormData({ ...formData, limit: e.target.value })}
          placeholder="Budget Limit"
          className="w-full px-4 py-2 border rounded-lg"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetModal;
