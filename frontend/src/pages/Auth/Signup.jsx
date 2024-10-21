import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const currencies = [
  { symbol: "$", name: "USD", label: "US Dollar" },
  { symbol: "€", name: "EUR", label: "Euro" },
  { symbol: "£", name: "GBP", label: "British Pound" },
  { symbol: "¥", name: "JPY", label: "Japanese Yen" },
  { symbol: "₹", name: "INR", label: "Indian Rupee" },
];

const Signup = () => {
  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [currency, setCurrency] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleSignupPasswordVisibility = () =>
    setShowSignupPassword(!showSignupPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log("Signup form submitted:", {
      name,
      signupEmail,
      currency,
      signupPassword,
      confirmPassword,
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-6xl h-auto flex overflow-hidden">
        {/* Left Section */}
        <div className="w-1/3 bg-gradient-to-b from-blue-600 to-purple-600 p-8 flex flex-col justify-center items-center text-white">
          <div className="mb-8">
            <DollarSign className="h-16 w-16 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome</h1>
          <p className="text-center text-white/80 mb-8">
            You are just moments away from accessing your financial dashboard!
          </p>
          <Link
            to="/"
            className="text-white/90 hover:text-white text-sm font-medium transition-all duration-200 border border-white/20 rounded-xl px-6 py-3 hover:bg-white/10"
          >
            Already have an account? Sign in
          </Link>
        </div>

        {/* Right Section */}
        <div className="w-2/3 p-8">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Create Account
          </h2>

          <form onSubmit={handleSignupSubmit} className="space-y-5">
            <div className="flex space-x-4">
              <div className="transform hover:translate-x-1 transition-transform duration-200 w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="transform hover:translate-x-1 transition-transform duration-200 w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  required
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="transform hover:translate-x-1 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Currency
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <option value="">Select currency</option>
                {currencies.map((currency) => (
                  <option key={currency.name} value={currency.name}>
                    {currency.symbol} - {currency.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="transform hover:translate-x-1 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleSignupPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                >
                  {showSignupPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="transform hover:translate-x-1 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              Create Account
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
