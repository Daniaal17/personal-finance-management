import React, { useState } from "react";
import {
  DollarSign,
  Wallet,
  TrendingUp,
  Bell,
  User,
  Search,
  Menu,
  Home,
  PieChart,
  Calendar,
  Settings,
  HelpCircle,
  ChevronDown,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
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
} from "recharts";

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month");

  // Sample data - replace with real data
  const chartData = [
    { name: "Jan", income: 4000, expenses: 2400 },
    { name: "Feb", income: 3000, expenses: 1398 },
    { name: "Mar", income: 2000, expenses: 9800 },
    { name: "Apr", income: 2780, expenses: 3908 },
    { name: "May", income: 1890, expenses: 4800 },
    { name: "Jun", income: 2390, expenses: 3800 },
  ];

  const expensesByCategory = [
    { name: "Housing", value: 1200 },
    { name: "Food", value: 800 },
    { name: "Transport", value: 600 },
    { name: "Shopping", value: 400 },
  ];

  const dailySpending = [
    { day: "Mon", amount: 120 },
    { day: "Tue", amount: 80 },
    { day: "Wed", amount: 190 },
    { day: "Thu", amount: 150 },
    { day: "Fri", amount: 210 },
    { day: "Sat", amount: 290 },
    { day: "Sun", amount: 180 },
  ];

  const cards = [
    {
      id: 1,
      bank: "Chase",
      number: "**** 4242",
      balance: 5240.5,
      color: "from-blue-400 to-blue-600",
    },
    {
      id: 2,
      bank: "Citi",
      number: "**** 8790",
      balance: 3850.75,
      color: "from-purple-400 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 flex">
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Main Dashboard Content */}
        <main className="p-6 overflow-auto h-[calc(100vh-4rem)]">
          {/* Period Selector */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Financial Overview</h1>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 hover:border-purple-500 transition-all">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`bg-gradient-to-r ${card.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-white/80">{card.bank}</p>
                    <p className="text-sm">{card.number}</p>
                  </div>
                  <DollarSign className="h-6 w-6 text-white/80" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-white/80">Balance</p>
                  <p className="text-2xl font-bold">
                    ${card.balance.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex justify-between items-start mb-4">
                <p className="text-gray-600">Total Balance</p>
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold">$9,091.25</p>
              <p className="text-sm text-green-500">+2.5% from last month</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Income vs Expenses Chart */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Income vs Expenses</h2>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
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
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#8B5CF6"
                    fillOpacity={1}
                    fill="url(#income)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="#60A5FA"
                    fillOpacity={1}
                    fill="url(#expenses)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Spending Chart */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Daily Spending</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Expense Categories */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Expense Categories</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expensesByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" stroke="#6B7280" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60A5FA" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Spending Trends */}
            <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
              <h2 className="text-lg font-bold mb-4">Spending Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
