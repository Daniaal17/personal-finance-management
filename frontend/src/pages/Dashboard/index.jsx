import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    dailySpending: [],
    expensesByCategory: [],
    monthlyComparison: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  

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

  const preferredCurrency = JSON.parse(localStorage.getItem("user")).currency?.name;

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
    <div className="min-h-screen w-full  flex">
      <div className="flex-1 overflow-hidden">
        <main className="p-6 overflow-auto ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Income vs Expenses Chart */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Income vs Expenses</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart 
                    data={dashboardData?.monthlyComparison}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6B7280"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tickFormatter={currencyFormatter}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => currencyFormatter(value)}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#income)"
                      name="Income"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="#60A5FA"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#expenses)"
                      name="Expenses"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Spending Chart */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg ">
              <h2 className="text-lg font-bold mb-4">Daily Spending</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={dashboardData?.dailySpending}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="_id" 
                      stroke="#6B7280"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tickFormatter={currencyFormatter}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => currencyFormatter(value)}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Bar 
                      dataKey="totalAmount" 
                      fill="#8B5CF6" 
                      radius={[4, 4, 0, 0]}
                      name="Spending"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Categories Chart */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Expense Categories</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={dashboardData?.expensesByCategory} 
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      type="number" 
                      stroke="#6B7280"
                      tickFormatter={currencyFormatter}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      dataKey="_id" 
                      type="category" 
                      stroke="#6B7280"
                      tick={{ fontSize: 12 }}
                      width={100}
                    />
                    <Tooltip 
                      formatter={(value) => currencyFormatter(value)}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                    />
                    <Bar 
                      dataKey="total" 
                      fill="#60A5FA" 
                      radius={[0, 4, 4, 0]}
                      name="Total Spent"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Spending Trends Chart */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Spending Trends</h2>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={dashboardData?.monthlyComparison}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#6B7280"
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      tickFormatter={currencyFormatter}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => currencyFormatter(value)}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('default', { month: 'long', year: 'numeric' });
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Expenses"
                    />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#60A5FA"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Income"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;