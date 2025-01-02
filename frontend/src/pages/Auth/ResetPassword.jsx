import axios from "axios";
import { ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { failureToaster, successToaster } from "../../utils/swal";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const otp = location.state?.otp;
  const email = location.state?.email;

  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePasswords = () => {
    const validationErrors = {};
    if (!passwords.newPassword) {
      validationErrors.newPassword = "New password is required.";
    } else if (passwords.newPassword.length < 6) {
      validationErrors.newPassword = "Password must be at least 6 characters.";
    }

    if (!passwords.confirmPassword) {
      validationErrors.confirmPassword = "Confirm password is required.";
    } else if (passwords.newPassword !== passwords.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match.";
    }

    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const validationErrors = validatePasswords();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;
    const payload = {
      otp: otp,
      password: passwords.newPassword,
      email: email,
    };
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/set-new-password",
        payload
      );
      successToaster("Password reset successfully");
      navigate("/auth/login");
    } catch (error) {
      failureToaster(error.response.data.message);

      console.error("Error resetting password:", error);
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
          <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
          <p className="text-center text-white/80 mb-8">
            Choose a strong password to protect your account.
          </p>
        </div>

        {/* Right Section */}
        <div className="w-2/3 p-12">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Create New Password
          </h2>
          <p className="text-gray-600 mb-8">
            Your new password must be different from previously used passwords.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {submitted && errors.newPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({
                      ...passwords,
                      confirmPassword: e.target.value,
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              Reset Password
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
