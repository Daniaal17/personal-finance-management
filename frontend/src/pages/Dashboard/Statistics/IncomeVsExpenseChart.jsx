import ReacmonthlyComparisont from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend} from "recharts";
import NoDataOverlay from './NoDataOverlay';
const IncomeVsExpenseChart = ({monthlyComparison, currencyFormatter}) => {

   // Empty state data for consistent axis rendering
   const emptyTimeData = Array.from({ length: 6 }, (_, i) => ({
    month: new Date(new Date().setMonth(new Date().getMonth() - i)).toISOString(),
    income: 0,
    expenses: 0
  })).reverse();

  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg relative">
                 <h2 className="text-lg font-bold mb-4">Income vs Expenses</h2>
                 <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                     <AreaChart 
                       data={monthlyComparison?.length ? monthlyComparison : emptyTimeData}
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
                   {!monthlyComparison.length && <NoDataOverlay />}
                 </div>
               </div>
   
  )
}

export default IncomeVsExpenseChart