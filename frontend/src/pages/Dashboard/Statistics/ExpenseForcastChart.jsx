import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import NoDataOverlay from './NoDataOverlay';
import axios from 'axios';

const ExpenseForecastChart = ({ currencyFormatter }) => {
  const [futureExpenses, setFutureExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecastData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:8000/api/user/forecast-expenses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFutureExpenses(response.data.forecast || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecastData();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Future Expense Forecast
      </h2>
      <div className="h-[400px]">
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={futureExpenses}
              margin={{
                top: 20,
                right: 30,
                left: 65,
                bottom: 30,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{
                  value: "Month",
                  position: "insideBottom",
                  offset: -10,
                }}
                tickFormatter={(value) => {
                  const date = new Date(`${value}-01`);
                  return date.toLocaleDateString('default', { month: 'short', year: '2-digit' });
                }}
              />
              <YAxis
                tickFormatter={currencyFormatter}
                label={{
                  value: "Projected Expenses ($)",
                  angle: -90,
                  position: "insideLeft",
                  offset: -50,
                }}
              />
              <Tooltip
                formatter={(value) => [currencyFormatter(value), "Projected Expenses"]}
                labelFormatter={(value) => `Month: ${value}`}
              />
              <Line
                type="monotone"
                dataKey="predictedAmount"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                name="Forecasted Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        {!futureExpenses?.length && !isLoading && <NoDataOverlay />}
      </div>
    </div>
  );
};

export default ExpenseForecastChart;
