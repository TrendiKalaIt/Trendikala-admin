import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setSidebarOpen(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Topbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Topbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      </div>

      <div className="flex flex-1 pt-14">
        {/* Fixed Sidebar */}
        <div className="fixed top-14 bottom-0 left-0 z-40">
          <Sidebar isOpen={sidebarOpen} />
        </div>

        {/* Main Content: Margin adjusted to sidebar width */}
        <main
          className={`flex-1 overflow-y-auto lg:mt-2 mt-5
           p-0 transition-all duration-300
            ${sidebarOpen && windowWidth >= 768 ? "ml-64" : "ml-16"}
          `}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
