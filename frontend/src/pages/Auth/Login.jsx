import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const toggleLoginPasswordVisibility = () =>
    setShowLoginPassword(!showLoginPassword);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", { loginEmail, loginPassword });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 flex items-center justify-center p-4 animate-gradient-x">
      <div className="bg-white/80 s rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 w-full max-w-md transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl shadow-lg transform hover:rotate-6 transition-transform duration-300">
            <DollarSign className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Login
        </h2>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div className="transform hover:translate-x-1 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="you@example.com"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          <div className="transform hover:translate-x-1 transition-transform duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={toggleLoginPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
          >
            Sign In
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/signup"
            className="text-gray-600 hover:text-purple-600 text-sm font-medium transition-colors duration-200"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
