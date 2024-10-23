import React, { useState } from "react";
import { ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { failureToaster, successToaster } from "../../utils/swal";
import axios from "axios";

// Forgot Password Component
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email format is invalid.");
      return;
    }
    try {
      await axios.post(`http://localhost:8000/api/auth/otp/resend/${email}`);
      localStorage.setItem("email", email);
      successToaster("Otp sent successfully");
      setIsSuccess(true);
      navigate("/auth/verification", { state: { type: "reset" } });
      setError("");
    } catch (error) {
      console.log("Error", error);
      failureToaster(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 flex items-center justify-center p-6">
      <div className="bg-white/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-6xl h-auto flex overflow-hidden">
        {/* Left Section */}
        <div className="w-1/3 bg-gradient-to-b from-blue-600 to-purple-600 p-8 flex flex-col justify-center items-center text-white">
          <div className="mb-8">
            <KeyRound className="h-16 w-16 text-white animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Forgot Password?</h1>
          <p className="text-center text-white/80 mb-8">
            Don't worry! It happens. Please enter the email associated with your
            account.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-2/3 p-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Password Recovery
          </h2>
          <p className="text-gray-600 mb-8">
            We'll send you an OTP to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (submitted) setError("");
                }}
              />
              {submitted && error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-xl hover:opacity-90 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              Send OTP
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
