import React, { useState, useEffect } from "react";
import { User, Upload, Save } from "lucide-react";
import currencies from './../../../constants/currencyList';
import axios from "axios";
import { failureToaster, successToaster } from "../../../utils/swal";
import PasswordUpdate from "./PasswordUpdate";

const Settings = () => {
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    currency: "",
    profileImage: null,
    avatarPreview: null
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData) {
      setProfileData(prevState => ({
        ...prevState,
        fullName: userData.fullName || "",
        email: userData.email || "",
        currency: userData.currency || { name: "USD", symbol: "$" },
        avatarPreview: userData.profileImage || null // Load existing profile image if any
      }));
    }
  }, []);

  const [profileUpdateStatus, setProfileUpdateStatus] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        failureToaster("Image size should be less than 5MB");
        return;
      }

      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/i)) {
        failureToaster("Please upload a valid image file (JPG, PNG, or GIF)");
        return;
      }

      setProfileData({
        ...profileData,
        profileImage: file,
        avatarPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileUpdateStatus("loading");
    const token = localStorage.getItem("token");
    
    const formData = new FormData();
    formData.append('fullName', profileData.fullName);
    formData.append('currency', JSON.stringify(profileData.currency));
    
    if (profileData.profileImage) {
      formData.append('profileImage', profileData.profileImage);
    }

    try {
      const response = await axios({
        method: "put",
        url: "http://localhost:8000/api/user/update",
        headers: {
          Authorization: `Bearer ${token}`,
          // Remove Content-Type header to let browser set it with boundary for FormData
        },
        data: formData
      });

      console.log("Form data", formData)

      // Clean up old avatar preview URL if it exists
      if (profileData.avatarPreview && profileData.avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(profileData.avatarPreview);
      }

      const updatedUserData = response.data.data;
      localStorage.setItem("user", JSON.stringify(updatedUserData));
      
      setProfileData(prevState => ({
        ...prevState,
        avatarPreview: updatedUserData.profileImage || null
      }));

      successToaster("Profile updated successfully");
      setProfileUpdateStatus("success");

      setTimeout(() => {
        setProfileUpdateStatus(null);
      }, 3000);
      
    } catch (error) {
      failureToaster(error.response?.data?.message || "Error updating profile");
      setProfileUpdateStatus("error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Account Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
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

            <div className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
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
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
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
                  value={profileData.currency.name}
                  onChange={(e) => {
                    const selectedCurrency = currencies.find(
                      (currency) => currency.name === e.target.value
                    );
                    setProfileData({
                      ...profileData,
                      currency: selectedCurrency || { name: "USD", symbol: "$" }
                    });
                    
                  }}
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
        <PasswordUpdate/>
      </div>
    </div>
  );
};

export default Settings;
