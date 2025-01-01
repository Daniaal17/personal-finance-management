import React from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import NoDataOverlay from './NoDataOverlay';

const ExpenseTrends = ({monthlyComparison, currencyFormatter}) => {
  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
    <h2 className="text-lg font-bold mb-4">Spending Trends</h2>
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={monthlyComparison}
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
      {!monthlyComparison.length && <NoDataOverlay />}
    </div>
  </div>
  )
}

export default ExpenseTrends