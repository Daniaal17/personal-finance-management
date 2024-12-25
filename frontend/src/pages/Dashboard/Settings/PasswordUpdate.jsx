import { Lock } from 'lucide-react'
import { useState } from 'react';
import { failureToaster, successToaster } from '../../../utils/swal';
import axios from 'axios';

const PasswordUpdate = () => {
  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null);
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    server: ''
  });

  // Validate passwords before submission
  const validatePasswords = () => {
    let isValid = true;
    const newErrors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      server: ''
    };

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
      isValid = false;
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePasswordSubmit = async(e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      server: ''
    });

    // Validate before submission
    if (!validatePasswords()) {
      return;
    }

    setPasswordUpdateStatus("loading");
    const token = localStorage.getItem("token");

    try {
      const response = await axios({
        method: "put",
        url: "http://localhost:8000/api/user/update-password",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        },
      });

      setPasswordUpdateStatus("success");
      successToaster("Password Changed successfully");
      
      // Clear form after successful update
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (error) {
      setPasswordUpdateStatus(null);
      
      if (error.response?.data?.message) {
        setErrors(prev => ({
          ...prev,
          server: error.response.data.message
        }));
        failureToaster(error.response.data.message);
      } else {
        setErrors(prev => ({
          ...prev,
          server: 'An error occurred while updating the password. Please try again.'
        }));
        failureToaster('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white/80 rounded-2xl p-6 shadow-lg h-fit">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Lock className="h-5 w-5 text-purple-600" />
        Update Password
      </h2>

      <form onSubmit={handlePasswordSubmit}>
        <div className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 border ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 border ${
                errors.newPassword ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              className={`w-full px-4 py-3 border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
              } rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200`}
              value={passwordData.confirmPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Server Error Message */}
        {errors.server && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{errors.server}</p>
          </div>
        )}

        {/* Update Password Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={passwordUpdateStatus === "loading"}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {passwordUpdateStatus === "loading" ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Update Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PasswordUpdate;