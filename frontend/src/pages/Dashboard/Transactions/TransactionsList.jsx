import React from "react";
import { Edit, Trash2, DollarSign } from "lucide-react";
import { confirmationAlert } from "../../../utils/swal";

const TransactionsList = ({ transactions, budgets, onEdit, onDelete }) => {
  const getBudgetName = (budgetId) => {
    const budget = budgets.find((b) => b._id === budgetId);
    return budget ? budget.name : "Unknown Budget";
  };

  const getBudgetEmoji = (budgetId) => {
    const budget = budgets?.find((b) => b._id === budgetId);
    return budget ? budget.emoji : "💰";
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm">
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
      </div>
    );
  }

  return (
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
                  {getBudgetEmoji(transaction.budget._id)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {transaction.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {getBudgetName(transaction.budget._id)} •{" "}
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
              <div className="flex items-center">
                <button
                  onClick={() => onEdit(transaction)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <Edit />
                </button>
                <button
                  onClick={() => confirmationAlert(() => onDelete(transaction._id))}
                  className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionsList;