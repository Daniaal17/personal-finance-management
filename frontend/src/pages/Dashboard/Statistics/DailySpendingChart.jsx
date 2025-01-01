import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import NoDataOverlay from './NoDataOverlay';

const DailySpendingChart = ({ dailySpending, currencyFormatter }) => {

  // Generate empty daily data for the last 7 days
  const emptyDailyData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(new Date().setDate(new Date().getDate() - i)).toISOString().split('T')[0],
    totalAmount: 0,
  })).reverse();

  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg relative">
      <h2 className="text-lg font-bold mb-4">Daily Spending</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={dailySpending?.length ? dailySpending : emptyDailyData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="date" // Use the correct field name
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
        {!dailySpending?.length && <NoDataOverlay />}
      </div>
    </div>
  );
};

export default DailySpendingChart;
