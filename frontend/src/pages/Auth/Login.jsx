import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, DollarSign } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { failureToaster, successToaster } from "../../utils/swal";

// Default values for the login form
const defaultBody = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(defaultBody); // Form data state
  const [errors, setErrors] = useState({}); // Errors state
  const [submitted, setSubmitted] = useState(false); // Track form submission
  const [showLoginPassword, setShowLoginPassword] = useState(false); // Toggle password visibility

  const toggleLoginPasswordVisibility = () =>
    setShowLoginPassword(!showLoginPassword);

  // Validation logic for each field
  const validateField = (name, value) => {
    const fieldErrors = {};
    if (name === "email") {
      if (!value.trim()) {
        fieldErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        fieldErrors.email = "Email format is invalid.";
      }
    }
    if (name === "password") {
      if (!value.trim()) {
        fieldErrors.password = "Password is required.";
      } else if (value.length < 6) {
        fieldErrors.password = "Password must be at least 6 characters.";
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true); // Mark form as submitted
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (!Object.keys(validationErrors).length === 0) return;
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/login",
        data
      );
      successToaster("Login Successfully");
      console.log("USer", response)
      localStorage.setItem("user", JSON.stringify(response.data.data));
      localStorage.setItem("token", response.data.data?.token)

      navigate("/dashboard");
      
    } catch (error) {
      failureToaster(error.response.data.message);
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
          {/* Email Field */}
          <div className="">
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
            {(submitted || errors.email) && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showLoginPassword ? "text" : "password"}
                name="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                value={data.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              <button
                type="button"
                onClick={toggleLoginPasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
              >
                {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {(submitted || errors.password) && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
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
          <div className="text-gray-600  text-sm font-medium ">
            Did'nt remember password?{" "}
            <Link
              to="/auth/forgot-password"
              className="text-gray-600 underline font-xl hover:text-purple-600 transition-colors duration-200"
            >
              Reset Password
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/auth/signup"
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
