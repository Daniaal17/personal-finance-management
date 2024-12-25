import { Search, FilterXIcon } from "lucide-react";

const BudgetFilter = ({ onFilterChange, filters }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleMinAmountChange = (e) => {
    onFilterChange({ ...filters, minAmount: e.target.value });
  };

  const handleMaxAmountChange = (e) => {
    onFilterChange({ ...filters, maxAmount: e.target.value });
  };

  const clearFilter = () => {
    onFilterChange({ search: "", minAmount: "", maxAmount: "" });
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
        <input
          type="number"
          min={0}
          placeholder="Min Amount "
          name="minAmount"
          value={filters.minAmount}
          onChange={handleMinAmountChange}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
        />

        <input
          type="number"
          min={0}
          placeholder="Max Amount "
          name="maxAmount"
          value={filters.maxAmount}
          onChange={handleMaxAmountChange}
          className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Clear Filter Button */}
      <button
        onClick={clearFilter}
        className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
        title="Clear Filters"
      >
        <FilterXIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default BudgetFilter;
