import React from "react";
import { NavLink } from "react-router-dom";
import {
  DollarSign,
  Home,
  Wallet,
  TrendingUp,
  PieChart,
  Calendar,
  Settings,
  HelpCircle,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen }) => {
  const navItems = [
    { icon: <Home />, label: "Dashboard", path: "/dashboard" },
    { icon: <Wallet />, label: "Transactions", path: "/transactions" },
    { icon: <TrendingUp />, label: "Analytics", path: "/analytics" },
    { icon: <PieChart />, label: "Budgets", path: "/budgets" },
    { icon: <Calendar />, label: "Calendar", path: "/calendar" },
  ];

  const bottomNavItems = [
    { icon: <Settings />, label: "Settings", path: "/settings" },
    { icon: <HelpCircle />, label: "Help", path: "/help" },
  ];

  const NavItem = ({ icon, label, path }) => (
    <NavLink
      to={path}
      className={({ isActive }) => `
        w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-purple-50 transition-all
        ${isActive ? "bg-purple-50 text-purple-600" : "text-gray-600"}
      `}
    >
      {icon}
      {isSidebarOpen && <span>{label}</span>}
    </NavLink>
  );

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-white/80 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      <div className="p-4 flex items-center space-x-3">
        <DollarSign className="h-8 w-8 text-purple-600" />
        {isSidebarOpen && (
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            FinanceTracker
          </span>
        )}
      </div>

      <nav className="flex-1 p-4">
        {navItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        {bottomNavItems.map((item, index) => (
          <NavItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
