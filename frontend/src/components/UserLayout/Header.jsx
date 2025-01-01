import { Menu, User } from "lucide-react";
import Notifications from "../Notifications";
import { useContext } from "react";
import { ProfileContext } from "../../ProfileContext";

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { profile } = useContext(ProfileContext);

  const profileImage = profile?.profileImage; // Get profile image from context
  const fullName = profile?.fullName || ""; // Get profile image from context


  // const profileImage = JSON.parse(localStorage.getItem("user"))?.profileImage;

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl hover:bg-gray-100"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex items-center space-x-4">
          <Notifications />
          

          <div className="flex items-center space-x-2 gap-2">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage || "/assets/images/no_image.png"}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-purple-100 text-purple-600">
                  <User className="h-12 w-12" />
                </div>
              )}
            
            </div>
           <div className="">{fullName}</div> 
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
