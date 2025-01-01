import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, LineChart, Line, Legend,
} from "recharts";
import NoDataOverlay from './NoDataOverlay';
const ExpenseCategoriesChart = ({expensesByCategory,currencyFormatter }) => {

  const emptyCategoryData = [
    { _id: "Category 1", total: 0 },
    { _id: "Category 2", total: 0 },
    { _id: "Category 3", total: 0 }
  ];
  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg relative">
                <h2 className="text-lg font-bold mb-4">Expense Categories</h2>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={expensesByCategory?.length ?expensesByCategory : emptyCategoryData}
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
                  {!expensesByCategory?.length && <NoDataOverlay />}
                </div>
              </div>
  )
}

export default ExpenseCategoriesChart