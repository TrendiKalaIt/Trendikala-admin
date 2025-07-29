import { useUser } from "../context/UserContext";
import { ChevronDown } from "lucide-react";
import logo from '../assets/images/trendikala_logo_bg.png';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { user } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-[#93A87E] px-6 py-3 flex justify-between items-center w-full relative">
      <div className="flex items-center gap-2">
        <img src={logo} alt="Logo" className="h-10" />
        <span className="text-2xl font-bold font-dashboard text-[#f0f2f0]">Trendi Kala</span>
      </div>

      <div className="relative">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <div className="w-9 h-9 rounded-full bg-green-400 text-white flex items-center justify-center font-bold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="text-right">
            <div className="text-[#f0f2f0] font-medium">
              {user?.name || "Unknown"}
            </div>
            <div className="text-sm text-[#f0f2f0] italic capitalize">
              {user?.role || "Role"}
            </div>
          </div>
          <ChevronDown size={18} className="text-[#eaecea]" />
        </div>

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
