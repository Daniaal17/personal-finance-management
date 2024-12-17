import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Calculator, DollarSign, TrendingUp, PiggyBank } from "lucide-react";

const RetirementPlanner = () => {
  const [incomes, setIncomes] = useState([]);
  const [retirementStats, setRetirementStats] = useState({
    totalSaved: 0,
    monthlyAverage: 0,
    projectedTotal: 0,
  });
  const [planningData, setPlanningData] = useState({
    currentAge: "",
    retirementAge: "",
    monthlyContribution: "",
    currentSavings: "",
    expectedReturn: "7",
  });
  const [projections, setProjections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIncomes();
  }, []);

  const fetchIncomes = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/income/all-incomes"
      );
      if (!response.ok) throw new Error("Failed to fetch income data");
      const data = await response.json();
      setIncomes(data);
      calculateRetirementStats(data);
    } catch (err) {
      setError("Error fetching income data");
    }
  };

  const calculateRetirementStats = (incomeData) => {
    const totalRetirementSavings = incomeData.reduce(
      (sum, income) => sum + (income.allocatedToRetirement || 0),
      0
    );
    const monthlyAverage =
      incomeData.length > 0 ? totalRetirementSavings / incomeData.length : 0;

    setRetirementStats({
      totalSaved: totalRetirementSavings,
      monthlyAverage: monthlyAverage,
      projectedTotal: totalRetirementSavings,
    });
  };

  const calculateProjections = () => {
    const {
      currentAge,
      retirementAge,
      monthlyContribution,
      currentSavings,
      expectedReturn,
    } = planningData;

    if (
      !currentAge ||
      !retirementAge ||
      !monthlyContribution ||
      !currentSavings ||
      !expectedReturn
    ) {
      setError("Please fill in all fields");
      return;
    }

    const years = parseInt(retirementAge) - parseInt(currentAge);
    const monthlyRate = parseFloat(expectedReturn) / 100 / 12;
    const months = years * 12;

    let projectedData = [];
    let currentTotal = parseFloat(currentSavings);
    const monthlyContributionFloat = parseFloat(monthlyContribution);

    for (let year = 0; year <= years; year++) {
      let yearlyTotal = currentTotal;
      for (let month = 0; month < 12; month++) {
        yearlyTotal =
          yearlyTotal * (1 + monthlyRate) + monthlyContributionFloat;
      }
      currentTotal = yearlyTotal;

      projectedData.push({
        age: parseInt(currentAge) + year,
        savings: Math.round(yearlyTotal),
      });
    }

    setProjections(projectedData);
    setError("");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retirement Planning Tool
          </h1>
          <p className="text-gray-600">
            Plan and track your retirement savings journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PiggyBank className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Total Saved
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(retirementStats.totalSaved)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Lifetime retirement savings
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Average
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(retirementStats.monthlyAverage)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Average monthly contribution
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Projected Total
              </h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(
                projections[projections.length - 1]?.savings || 0
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">Expected at retirement</p>
          </div>
        </div>

        {/* Planning Calculator */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              Retirement Calculator
            </h2>
            <p className="text-gray-500 mt-1">
              Calculate your projected retirement savings
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Age
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.currentAge}
                  onChange={(e) =>
                    setPlanningData({
                      ...planningData,
                      currentAge: e.target.value,
                    })
                  }
                  placeholder="e.g., 30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retirement Age
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.retirementAge}
                  onChange={(e) =>
                    setPlanningData({
                      ...planningData,
                      retirementAge: e.target.value,
                    })
                  }
                  placeholder="e.g., 65"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Savings
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.currentSavings}
                  onChange={(e) =>
                    setPlanningData({
                      ...planningData,
                      currentSavings: e.target.value,
                    })
                  }
                  placeholder="e.g., 50000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Contribution
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.monthlyContribution}
                  onChange={(e) =>
                    setPlanningData({
                      ...planningData,
                      monthlyContribution: e.target.value,
                    })
                  }
                  placeholder="e.g., 500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Annual Return (%)
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={planningData.expectedReturn}
                  onChange={(e) =>
                    setPlanningData({
                      ...planningData,
                      expectedReturn: e.target.value,
                    })
                  }
                  placeholder="e.g., 7"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={calculateProjections}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Calculate Projection
                </button>
              </div>
            </div>

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
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={projections}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="age"
                    label={{ value: "Age", position: "bottom", offset: 0 }}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value)}
                    label={{
                      value: "Projected Savings",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Projected Savings",
                    ]}
                    labelFormatter={(value) => `Age ${value}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#2563eb"
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

//
// import React, { useState, useEffect } from "react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   ReferenceLine,
// } from "recharts";
// import {
//   Calculator,
//   DollarSign,
//   TrendingUp,
//   PiggyBank,
//   Target,
// } from "lucide-react";

// const RetirementPlanner = () => {
//   const [incomes, setIncomes] = useState([]);
//   const [retirementStats, setRetirementStats] = useState({
//     totalSaved: 0,
//     monthlyAverage: 0,
//     projectedTotal: 0,
//     monthlyRetirementIncome: 0,
//     savingsGap: 0,
//     goalProgress: 0,
//   });
//   const [planningData, setPlanningData] = useState({
//     currentAge: "",
//     retirementAge: "",
//     monthlyContribution: "",
//     currentSavings: "",
//     expectedReturn: "7",
//     desiredMonthlyIncome: "", // New field
//     lifeExpectancy: "85", // New field with default
//   });
//   const [projections, setProjections] = useState([]);
//   const [error, setError] = useState("");
//   const [retirementGoal, setRetirementGoal] = useState(0);

//   useEffect(() => {
//     fetchIncomes();
//   }, []);

//   const fetchIncomes = async () => {
//     try {
//       const response = await fetch(
//         "http://localhost:8000/api/income/all-incomes"
//       );
//       if (!response.ok) throw new Error("Failed to fetch income data");
//       const data = await response.json();
//       setIncomes(data);
//       calculateRetirementStats(data);
//     } catch (err) {
//       setError("Error fetching income data");
//     }
//   };

//   const calculateRetirementGoal = () => {
//     const {
//       desiredMonthlyIncome,
//       retirementAge,
//       lifeExpectancy,
//       expectedReturn,
//     } = planningData;

//     if (!desiredMonthlyIncome || !retirementAge || !lifeExpectancy) return 0;

//     const yearlyIncome = parseFloat(desiredMonthlyIncome) * 12;
//     const retirementYears = parseInt(lifeExpectancy) - parseInt(retirementAge);
//     const withdrawalRate = parseFloat(expectedReturn) / 100 - 0.02; // Assuming 2% lower than return rate for safety

//     // Using the simple formula: Goal = Yearly Income / Withdrawal Rate
//     const requiredAmount = yearlyIncome / withdrawalRate;
//     return Math.round(requiredAmount);
//   };

//   const calculateRetirementStats = (incomeData) => {
//     const totalRetirementSavings = incomeData.reduce(
//       (sum, income) => sum + (income.allocatedToRetirement || 0),
//       0
//     );
//     const monthlyAverage =
//       incomeData.length > 0 ? totalRetirementSavings / incomeData.length : 0;

//     const goal = calculateRetirementGoal();
//     const projectedFinal = projections[projections.length - 1]?.savings || 0;
//     const savingsGap = goal - projectedFinal;
//     const goalProgress = goal > 0 ? (projectedFinal / goal) * 100 : 0;

//     const monthlyRetirementIncome =
//       (projectedFinal *
//         (parseFloat(planningData.expectedReturn) / 100 - 0.02)) /
//       12;

//     setRetirementStats({
//       totalSaved: totalRetirementSavings,
//       monthlyAverage: monthlyAverage,
//       projectedTotal: projectedFinal,
//       monthlyRetirementIncome,
//       savingsGap,
//       goalProgress: Math.min(goalProgress, 100),
//     });
//   };

//   const calculateProjections = () => {
//     const {
//       currentAge,
//       retirementAge,
//       monthlyContribution,
//       currentSavings,
//       expectedReturn,
//       desiredMonthlyIncome,
//     } = planningData;

//     if (
//       !currentAge ||
//       !retirementAge ||
//       !monthlyContribution ||
//       !currentSavings ||
//       !expectedReturn ||
//       !desiredMonthlyIncome
//     ) {
//       setError("Please fill in all fields");
//       return;
//     }

//     const years = parseInt(retirementAge) - parseInt(currentAge);
//     const monthlyRate = parseFloat(expectedReturn) / 100 / 12;
//     const months = years * 12;

//     let projectedData = [];
//     let currentTotal = parseFloat(currentSavings);
//     const monthlyContributionFloat = parseFloat(monthlyContribution);

//     const goal = calculateRetirementGoal();
//     setRetirementGoal(goal);

//     for (let year = 0; year <= years; year++) {
//       let yearlyTotal = currentTotal;
//       for (let month = 0; month < 12; month++) {
//         yearlyTotal =
//           yearlyTotal * (1 + monthlyRate) + monthlyContributionFloat;
//       }
//       currentTotal = yearlyTotal;

//       projectedData.push({
//         age: parseInt(currentAge) + year,
//         savings: Math.round(yearlyTotal),
//       });
//     }

//     setProjections(projectedData);
//     calculateRetirementStats(incomes);
//     setError("");
//   };

//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat("en-US", {
//       style: "currency",
//       currency: "USD",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(value);
//   };

//   const getProgressColor = (progress) => {
//     if (progress >= 90) return "bg-green-600";
//     if (progress >= 60) return "bg-blue-600";
//     if (progress >= 30) return "bg-yellow-600";
//     return "bg-red-600";
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         {/* Header Section */}
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">
//             Retirement Planning Tool
//           </h1>
//           <p className="text-gray-600">Plan and track your retirement goals</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-white rounded-xl p-6 shadow-sm">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="p-2 bg-blue-100 rounded-lg">
//                 <Target className="h-6 w-6 text-blue-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Retirement Goal
//               </h3>
//             </div>
//             <p className="text-2xl font-bold text-gray-900">
//               {formatCurrency(retirementGoal)}
//             </p>
//             <div className="mt-2">
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div
//                   className={`h-2.5 rounded-full ${getProgressColor(
//                     retirementStats.goalProgress
//                   )}`}
//                   style={{ width: `${retirementStats.goalProgress}%` }}
//                 ></div>
//               </div>
//               <p className="text-sm text-gray-500 mt-1">
//                 {retirementStats.goalProgress.toFixed(1)}% of goal
//               </p>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <DollarSign className="h-6 w-6 text-green-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Monthly Income
//               </h3>
//             </div>
//             <p className="text-2xl font-bold text-gray-900">
//               {formatCurrency(retirementStats.monthlyRetirementIncome)}
//             </p>
//             <p className="text-sm text-gray-500 mt-1">
//               Projected monthly retirement income
//             </p>
//           </div>

//           <div className="bg-white rounded-xl p-6 shadow-sm">
//             <div className="flex items-center space-x-3 mb-4">
//               <div className="p-2 bg-purple-100 rounded-lg">
//                 <Calculator className="h-6 w-6 text-purple-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Savings Gap
//               </h3>
//             </div>
//             <p className="text-2xl font-bold text-gray-900">
//               {formatCurrency(Math.max(0, retirementStats.savingsGap))}
//             </p>
//             <p className="text-sm text-gray-500 mt-1">
//               Additional savings needed
//             </p>
//           </div>
//         </div>

//         {/* Planning Calculator */}
//         <div className="bg-white rounded-xl shadow-sm mb-8">
//           <div className="p-6 border-b border-gray-100">
//             <h2 className="text-xl font-semibold text-gray-900">
//               Retirement Calculator
//             </h2>
//             <p className="text-gray-500 mt-1">
//               Set your retirement goals and calculate projections
//             </p>
//           </div>

//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Current Age
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={planningData.currentAge}
//                   onChange={(e) =>
//                     setPlanningData({
//                       ...planningData,
//                       currentAge: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., 30"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Retirement Age
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={planningData.retirementAge}
//                   onChange={(e) =>
//                     setPlanningData({
//                       ...planningData,
//                       retirementAge: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., 65"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Life Expectancy
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={planningData.lifeExpectancy}
//                   onChange={(e) =>
//                     setPlanningData({
//                       ...planningData,
//                       lifeExpectancy: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., 85"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Current Savings
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={planningData.currentSavings}
//                   onChange={(e) =>
//                     setPlanningData({
//                       ...planningData,
//                       currentSavings: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., 50000"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Monthly Contribution
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={planningData.monthlyContribution}
//                   onChange={(e) =>
//                     setPlanningData({
//                       ...planningData,
//                       monthlyContribution: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., 500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Desired Monthly Income
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={planningData.desiredMonthlyIncome}
//                   onChange={(e) =>
//                     setPlanningData({
//                       ...planningData,
//                       desiredMonthlyIncome: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., 5000"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Expected Annual Return (%)
//                 </label>
//                 <input
//                   type="number"
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={planningData.expectedReturn}
//                   onChange={(e) =>
//                     setPlanningData({
//                       ...planningData,
//                       expectedReturn: e.target.value,
//                     })
//                   }
//                   placeholder="e.g., 7"
//                 />
//               </div>

//               <div className="flex items-end">
//                 <button
//                   onClick={calculateProjections}
//                   className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//                 >
//                   Calculate Projection
//                 </button>
//               </div>
//             </div>

//             {error && (
//               <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
//                 {error}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Projection Chart */}
//         {projections.length > 0 && (
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">
//               Retirement Savings Projection
//             </h2>
//             <div className="h-96">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={projections}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis
//                     dataKey="age"
//                     label={{ value: "Age", position: "bottom", offset: 0 }}
//                   />
//                   <YAxis
//                     tickFormatter={(value) => formatCurrency(value)}
//                     label={{
//                       value: "Projected Savings",
//                       angle: -90,
//                       position: "insideLeft",
//                     }}
//                   />
//                   <Tooltip
//                     formatter={(value) => [
//                       formatCurrency(value),
//                       "Projected Savings",
//                     ]}
//                     labelFormatter={(value) => `Age ${value}`}
//                   />
//                   <Legend />
//                   <Line
//                     type="monotone"
//                     dataKey="savings"
//                     stroke="#2563eb"
//                     name="Projected Savings"
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RetirementPlanner;
