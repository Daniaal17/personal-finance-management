import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import { successToaster, failureToaster } from "../../../utils/swal";
import AddBudgetModal from "./AddBudgetModal";
import EditBudgetModal from "./EditBudgetModal";
import BudgetFilter from "./BudgetFilter";
import BudgetsList from "./BudgetsList";

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [filters, setFilters] = useState({ search: "", minAmount: null, maxAmount: null });

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/budget/all-budgets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: filters
        });
        setBudgets(response.data);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    };
    fetchBudgets();
  }, [filters]);

  const handleDelete = async (budgetId) => {
    try {
      await axios.delete(`http://localhost:8000/api/budget/delete/${budgetId}`);
      successToaster("Budget deleted successfully");
      setBudgets(budgets.filter((budget) => budget._id !== budgetId));
    } catch (error) {
      failureToaster(error?.response?.data?.message || "Error deleting budget");
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="py-4">
          <h1 className="text-2xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-500">Manage your Budgets for the transactions</p>
        </div>
        
        <div className="my-5">
          <BudgetFilter onFilterChange={handleFilterChange} filters={filters} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => setIsAddModalOpen(true)}
            className="bg-white rounded-2xl p-6 shadow-sm border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-all"
          >
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Plus className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-gray-600 font-medium">Create New Budget</p>
          </div>

          <BudgetsList
            budgets={budgets}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {isAddModalOpen && (
          <AddBudgetModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={(newBudget) => setBudgets([...budgets, newBudget])}
          />
        )}

        {isEditModalOpen && selectedBudget && (
          <EditBudgetModal
            isOpen={isEditModalOpen}
            budget={selectedBudget}
            onClose={() => {
              setSelectedBudget(null);
              setIsEditModalOpen(false);
            }}
            onSubmit={(updatedBudget) =>
              setBudgets(
                budgets.map((budget) =>
                  budget._id === updatedBudget._id ? updatedBudget : budget
                )
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default Budget;