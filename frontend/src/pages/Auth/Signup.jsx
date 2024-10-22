import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import currencies from "../../constants/currencyList";
import axios from "axios";

const defaultBody = {
  email: "",
  name: "",
  currency: "",
  password: "",
  confirmPassword: "",
};

const Signup = () => {
  const [data, setData] = useState(defaultBody);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false); // Track if form was submitted
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleSignupPasswordVisibility = () =>
    setShowSignupPassword(!showSignupPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Validation logic for each field
  const validateField = (name, value) => {
    const fieldErrors = {};
    if (name === "name" && !value.trim()) {
      fieldErrors.name = "Full name is required.";
    }
    if (name === "email") {
      if (!value.trim()) {
        fieldErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        fieldErrors.email = "Email format is invalid.";
      }
    }
    if (name === "currency" && !value.trim()) {
      fieldErrors.currency = "Please select a preferred currency.";
    }
    if (name === "password") {
      if (!value.trim()) {
        fieldErrors.password = "Password is required.";
      } else if (value.length < 6) {
        fieldErrors.password = "Password must be at least 6 characters.";
      }
    }
    if (name === "confirmPassword") {
      if (!value.trim()) {
        fieldErrors.confirmPassword = "Confirm password is required.";
      } else if (value !== data.password) {
        fieldErrors.confirmPassword = "Passwords do not match.";
      }
    }
    return fieldErrors;
  };

  // Handle field blur (validate on blur)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErrors = validateField(name, value);
    setErrors({ ...errors, ...fieldErrors });
  };

  // Validate the entire form on submit
  const validateForm = () => {
    const validationErrors = {};
    Object.keys(data).forEach((field) => {
      const fieldErrors = validateField(field, data[field]);
      Object.assign(validationErrors, fieldErrors);
    });
    return validationErrors;
  };

  // Form submission handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Mark form as submitted
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // If there are errors, return early and don't proceed with the request
    if (Object.keys(validationErrors).length !== 0) return;

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/signup",
        data
      );

      navigate("/auth/verification", { state: { email: data.email } });

      console.log("Signup successful:", response.data);
    } catch (error) {
      console.error("Error during signup:", error);
    }
  };

  // Generic input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });

    // Clear errors for corrected fields after they are valid
    if (errors[name]) {
      const fieldErrors = validateField(name, value);
      if (!Object.keys(fieldErrors).length) {
        setErrors({ ...errors, [name]: "" });
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 flex items-center justify-center p-6">
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
            to="/auth/login"
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
                  name="name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="John Doe"
                  value={data.name}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {submitted && errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="transform hover:translate-x-1 transition-transform duration-200 w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                  value={data.email}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                />
                {submitted && errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="transform hover:translate-x-1 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Currency
              </label>
              <select
                name="currency"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={data.currency}
                onChange={handleInputChange}
                onBlur={handleBlur}
              >
                <option value="">Select currency</option>
                {currencies.map((currency) => (
                  <option key={currency.name} value={currency.name}>
                    {currency.symbol} - {currency.label}
                  </option>
                ))}
              </select>
              {submitted && errors.currency && (
                <p className="text-red-500 text-xs mt-1">{errors.currency}</p>
              )}
            </div>

            <div className="transform hover:translate-x-1 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showSignupPassword ? "text" : "password"}
                  name="password"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
              {submitted && errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="transform hover:translate-x-1 transition-transform duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={data.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
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
              {submitted && errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
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
