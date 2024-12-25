import  { useState } from 'react';
import { Search, FilterXIcon } from 'lucide-react';

const TransactionsFilter = ({ onFilterChange , filters}) => {


  const handleSearchChange = (e) => {
  
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStartDateChange = (e) => {
   
    onFilterChange({ ...filters, startDate: e.target.value });
  };

  const handleEndDateChange = (e) => {
   
    onFilterChange({ ...filters, endDate: e.target.value });
  };

  const clearFilter = () => {
    onFilterChange({ search: "", startDate: null, endDate: null });
  };

  return (
    <div className="w-full flex items-center space-x-4">
      {/* Search Input */}
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search transactions by name..."
          name="searchTerm"
          value={filters.search}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
        />
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      </div>

     

      {/* Date Input */}
      <div className="flex items-center space-x-4">
  <div className="flex items-center space-x-2">
    <label 
      htmlFor="startDate" 
      className="text-sm font-medium text-gray-700"
    >
      Start Date:
    </label>
    <input
      id="startDate"
      type="date"
      placeholder="Start date"
      name="startDate"
      value={filters.startDate || ""}
      onChange={handleStartDateChange}
      className="px-3 py-2 border border-gray-200 rounded-lg"
    />
  </div>

  <div className="flex items-center space-x-2">
    <label 
      htmlFor="endDate" 
      className="text-sm font-medium text-gray-700"
    >
      End Date:
    </label>
    <input
      id="endDate"
      type="date"
      name="endDate"
      placeholder="End date"
      value={filters.endDate || ""}
      onChange={handleEndDateChange}
      className="px-3 py-2 border border-gray-200 rounded-lg"
    />
  </div>
</div>

      {/* Clear Filter Button */}
      <button 
        onClick={clearFilter}
        className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
        title="Clear Filters"
      >
        <FilterXIcon  className="h-6 w-6" />
      </button>
    </div>
  );
};

export default TransactionsFilter;