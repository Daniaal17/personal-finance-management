import React from 'react';
import { NavLink } from "react-router-dom";
import {
  DollarSign,
  Home,
  Wallet,
  TrendingUp,
  PieChart,
  Settings,
  LogOut
} from "lucide-react";

const Sidebar = ({ isSidebarOpen }) => {
  const navItems = [
    { icon: <Home size={20} />, label: "Dashboard", path: "/dashboard" },
    { icon: <Wallet size={20} />, label: "Budget", path: "/budget" },
    { icon: <DollarSign size={20} />, label: "Transactions", path: "/transactions" },
    { icon: <TrendingUp size={20} />, label: "Income", path: "/income" },
    { icon: <PieChart size={20} />, label: "Retirement Planner", path: "/retirement" },
  ];

  const bottomNavItems = [
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
    { icon: <LogOut size={20} />, label: "Logout", path: "/auth/login" },
  ];

  const NavItem = ({ icon, label, path }) => (
    <NavLink
      to={path}
      className={({ isActive }) => `
        w-full flex items-center space-x-3 p-2 rounded-xl hover:bg-purple-50 transition-all
        ${isActive ? "bg-purple-50 text-purple-600" : "text-gray-600"}
      `}
    >
      {icon}
      {isSidebarOpen && <span className="text-sm">{label}</span>}
    </NavLink>
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      <div className="flex flex-col h-full px-3 py-4">
        <div className="mb-4">
          {isSidebarOpen && (
            <h1 className="text-lg font-bold text-purple-600">
              FinanceTracker
            </h1>
          )}
        </div>

        <div className="flex-1 space-y-1">
          {navItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </div>

        <div className="space-y-1 pt-2 border-t">
          {bottomNavItems.map((item, index) => (
            <NavItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;