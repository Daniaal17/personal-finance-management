import { createContext, useState, useEffect } from 'react';

// Create Context
export const ProfileContext = createContext();

// Provider component
export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState({
    fullName: '',
    profileImage: "",
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem('user')); // Assuming 'user' object in localStorage has the profile image
    if (savedProfile && savedProfile?.profileImage) {
      setProfile({
        fullName: savedProfile?.fullName || '', // Assuming userName exists in the localStorage object
        profileImage: savedProfile?.profileImage || '', // Profile image from localStorage
      });
    }
  }, []);


  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
