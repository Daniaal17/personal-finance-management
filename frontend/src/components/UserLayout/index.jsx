import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./SideBar";
import { ProfileProvider } from "../../ProfileContext";

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  return (
    <ProfileProvider> 
    <div className="h-screen w-full bg-gray-50 flex overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 overflow-auto ">
          <Outlet />
        </main>
      </div>
    </div>
    </ProfileProvider>
  );
};

export default UserLayout;