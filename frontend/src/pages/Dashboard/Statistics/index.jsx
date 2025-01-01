import React, { useState, useEffect } from "react";
import axios from "axios";
import IncomeVsExpenseChart from "./IncomeVsExpenseChart";
import DailySpendingChart from "./DailySpendingChart";
import ExpenseCategoriesChart from "./ExpenseCategoriesChart";
import ExpenseForcastChart from "./ExpenseForcastChart";
import ExpenseTrends from "./ExpenseTrends";

const Statistics = () => {
  const [dashboardData, setDashboardData] = useState({
    dailySpending: [],
    expensesByCategory: [],
    monthlyComparison: [],
    futureExpenses: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const preferredCurrency = JSON.parse(localStorage.getItem("user"))?.currency?.name;

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await axios('http://localhost:8000/api/user/dashboard-stats', 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDashboardData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Custom tooltip formatter for currency
  const currencyFormatter = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: preferredCurrency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };


  if (isLoading) return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-lg">Loading dashboard data...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="text-lg text-red-500">Error: {error}</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full flex">
      <div className="flex-1 overflow-hidden">
        <main className="p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Income vs Expenses Chart */}
          <IncomeVsExpenseChart currencyFormatter={currencyFormatter} monthlyComparison={dashboardData.monthlyComparison} />
          
            {/* Daily Spending Chart */}
            <DailySpendingChart dailySpending={dashboardData.dailySpending} currencyFormatter={currencyFormatter}/>


            {/* Expense Categories Chart */}
            <ExpenseCategoriesChart  expensesByCategory={dashboardData.expensesByCategory} currencyFormatter={currencyFormatter}/>

            <ExpenseTrends currencyFormatter={currencyFormatter} monthlyComparison={dashboardData.monthlyComparison}/>

           
            {/* Expense Forecast Chart */}


            <ExpenseForcastChart currencyFormatter={currencyFormatter} futureExpenses={dashboardData.futureExpenses}/>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Statistics;