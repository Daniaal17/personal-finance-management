import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {  TrendingUp, PiggyBank } from "lucide-react";
import axios from "axios";

const RetirementPlanner = () => {
  // State for storing income data and stats
  const [retirementStats, setRetirementStats] = useState({
    totalSaved: 0,
    monthlyAverage: 0,
  });

  const preferredCurrency = JSON.parse(localStorage.getItem("user"))?.currency;


  // State for form inputs
  const [planningData, setPlanningData] = useState({
    currentAge: "",
    retirementAge: "",
    monthlyContribution: "",
    currentSavings: "",
    expectedReturn: "7", // Default value of 7%
  });

  // State for projection results and error handling
  const [projections, setProjections] = useState([]);
  const [error, setError] = useState("");

  // Fetch income data when component mounts
  useEffect(() => {
    fetchIncomes();
  }, []);

  // Function to fetch income data from API
  const fetchIncomes = async () => {
    const token = localStorage.getItem("token");
    
    try {
      const response = await axios.get("http://localhost:8000/api/income/all-incomes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const incomeData = response.data;
   
      
      // Calculate retirement statistics
      calculateRetirementStats(incomeData);
      
      // Set initial current savings based on total retirement allocations
      const totalRetirementSavings = incomeData.reduce(
        (sum, income) => sum + (income.allocatedToRetirement || 0),
        0
      );
      setPlanningData(prev => ({
        ...prev,
        currentSavings: totalRetirementSavings.toString(),
      }));
    } catch (err) {
      setError("Error fetching income data");
      console.error(err);
    }
  };

  // Calculate total savings and monthly average
  const calculateRetirementStats = (incomeData) => {
    const totalRetirementSavings = incomeData.reduce(
      (sum, income) => sum + (income.allocatedToRetirement || 0),
      0
    );
    const monthlyAverage = incomeData.length > 0 ? totalRetirementSavings / incomeData.length : 0;

    setRetirementStats({
      totalSaved: totalRetirementSavings,
      monthlyAverage: monthlyAverage,
    });
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlanningData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Calculate retirement projections
  const calculateProjections = () => {
    const {
      currentAge,
      retirementAge,
      monthlyContribution,
      currentSavings,
      expectedReturn,
    } = planningData;

    // Validate inputs
    if (!currentAge || !retirementAge || !monthlyContribution || !currentSavings || !expectedReturn) {
      setError("Please fill in all fields");
      return;
    }

    const years = parseInt(retirementAge) - parseInt(currentAge);
    if (years <= 0) {
      setError("Retirement age must be greater than current age");
      return;
    }

    // Calculate monthly return rate
    const monthlyRate = parseFloat(expectedReturn) / 100 / 12;
    let currentTotal = parseFloat(currentSavings);
    const monthlyContributionFloat = parseFloat(monthlyContribution);

    // Generate projection data for each year
    const projectedData = Array.from({ length: years + 1 }, (_, year) => {
      currentTotal = currentTotal * Math.pow(1 + monthlyRate, 12) + 
                    12 * monthlyContributionFloat;
      return {
        age: parseInt(currentAge) + year,
        savings: Math.round(currentTotal),
      };
    });

    setProjections(projectedData);
    setError("");
  };

  // Format currency for display
  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: preferredCurrency?.name,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retirement Planning Tool
          </h1>
          <p className="text-gray-600">
            Plan and track your retirement savings journey
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Total Saved Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PiggyBank className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total Saved</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(retirementStats.totalSaved)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Lifetime retirement savings</p>
          </div>

          {/* Monthly Average Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Monthly Average</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(retirementStats.monthlyAverage)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Average monthly contribution</p>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Retirement Calculator</h2>
            <p className="text-gray-500 mt-1">Calculate your projected retirement savings</p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Age Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  name="currentAge"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.currentAge}
                  onChange={handleInputChange}
                  placeholder="e.g., 30"
                />
              </div>

              {/* Retirement Age Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retirement Age
                </label>
                <input
                  type="number"
                  name="retirementAge"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.retirementAge}
                  onChange={handleInputChange}
                  placeholder="e.g., 65"
                />
              </div>

              {/* Current Savings Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Savings ({preferredCurrency?.symbol})
                </label>
                <input
                  type="number"
                  name="currentSavings"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.currentSavings}
                  onChange={handleInputChange}
                  placeholder="e.g., 50000"
                />
              </div>

              {/* Monthly Contribution Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution ({preferredCurrency?.symbol})
                </label>
                <input
                  type="number"
                  name="monthlyContribution"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.monthlyContribution}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                />
              </div>

              {/* Expected Return Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  name="expectedReturn"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.expectedReturn}
                  onChange={handleInputChange}
                  placeholder="e.g., 7"
                />
              </div>

              {/* Calculate Button */}
              <div className="flex items-end">
                <button
                  onClick={calculateProjections}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Calculate Projection
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Projection Chart */}
        {projections.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Retirement Savings Projection
            </h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={projections}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 65,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="age" 
                    label={{ 
                      value: "Age (years)", 
                      position: "insideBottom", 
                      offset: -10 
                    }}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    label={{
                      value: "Projected Savings ($)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -50
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), "Projected Savings"]}
                    labelFormatter={(value) => `Age ${value}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name="Projected Savings"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RetirementPlanner;