import React from "react";
import { Edit, Trash } from "lucide-react";
import { confirmationAlert } from "../../../utils/swal";

const BudgetsList = ({ budgets, onEdit, onDelete }) => {
  const calculateProgress = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

 
  const preferredCurrency = JSON.parse(localStorage.getItem("user"))?.currency;

  
  return (
    <>
      {budgets.map((budget) => (
        <div
          key={budget._id}
          className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{budget.emoji}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{budget.name}</h3>
                <p className="text-gray-500 text-sm">
                  {preferredCurrency?.symbol || '$'}{budget?.spent?.toFixed(2)} of {preferredCurrency?.symbol || '$'}{budget?.limit?.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(budget)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit />
              </button>
              <button
                onClick={() =>
                  confirmationAlert(
                    () => onDelete(budget._id),
                    "Are you sure you want to delete this budget? All the transactions will be deleted for this budget"
                  )
                }
                className="text-red-400 hover:text-red-600"
              >
                <Trash />
              </button>
            </div>
          </div>
          <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-purple-500 transition-all"
              style={{
                width: `${calculateProgress(budget?.spent, budget?.limit)}%`,
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
};

export default BudgetsList;