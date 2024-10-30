import React, { useState } from "react";
import {
  User,
  Lock,
  Upload,
  Globe,
  Mail,
  Phone,
  Save,
  Check,
  AlertCircle,
} from "lucide-react";
// import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const Settings = () => {
  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    currency: "USD",
    avatar: null,
    avatarPreview: null,
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Status states
  const [profileUpdateStatus, setProfileUpdateStatus] = useState(null);
  const [passwordUpdateStatus, setPasswordUpdateStatus] = useState(null);

  // Available currencies
  const currencies = [
    { name: "USD", symbol: "$", label: "US Dollar" },
    { name: "EUR", symbol: "€", label: "Euro" },
    { name: "GBP", symbol: "£", label: "British Pound" },
    { name: "JPY", symbol: "¥", label: "Japanese Yen" },
    { name: "AUD", symbol: "A$", label: "Australian Dollar" },
    { name: "CAD", symbol: "C$", label: "Canadian Dollar" },
  ];

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData({
        ...profileData,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      });
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setProfileUpdateStatus("loading");
    setTimeout(() => {
      setProfileUpdateStatus("success");
      setTimeout(() => setProfileUpdateStatus(null), 3000);
    }, 1500);
  };

  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setPasswordUpdateStatus("loading");
    setTimeout(() => {
      setPasswordUpdateStatus("success");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordUpdateStatus(null), 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8"></h1>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="h-5 w-5 text-purple-600" />
          Profile Settings
        </h2>

        <form onSubmit={handleProfileSubmit}>
          {/* Avatar Upload */}
          <div className="mb-6 flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                {profileData.avatarPreview ? (
                  <img
                    src={profileData.avatarPreview}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-purple-100 text-purple-600">
                    <User className="h-12 w-12" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <Upload className="h-4 w-4" />
              </label>
            </div>
            <div>
              <h3 className="font-medium">Profile Photo</h3>
              <p className="text-sm text-gray-500">
                Upload a new profile photo
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={profileData.email}
                onChange={(e) =>
                  setProfileData({ ...profileData, email: e.target.value })
                }
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={profileData.phone}
                onChange={(e) =>
                  setProfileData({ ...profileData, phone: e.target.value })
                }
              />
            </div>

            {/* Currency Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Currency
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={profileData.currency}
                onChange={(e) =>
                  setProfileData({ ...profileData, currency: e.target.value })
                }
              >
                {currencies.map((currency) => (
                  <option key={currency.name} value={currency.name}>
                    {currency.symbol} - {currency.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Update Profile Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={profileUpdateStatus === "loading"}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {profileUpdateStatus === "loading" ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Update Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {/* Password Update Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
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
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>

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
    </div>
  );
};

export default Settings;
