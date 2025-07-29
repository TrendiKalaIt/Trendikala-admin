import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  Users,
  Settings,
} from "lucide-react";
import { useUser } from "../context/UserContext";

const Sidebar = ({ isOpen }) => {
  const { user } = useUser();
  const location = useLocation();

  //  Wait until user is loaded
  if (!user || !user.role) return null;

  //  Define menu with role access
  const menu = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
      roles: ["superadmin"],
    },
    {
      name: "Orders",
      path: "/orders",
      icon: ShoppingCart,
      roles: ["admin", "superadmin"],
    },
    {
      name: "Products",
      path: "/products",
      icon: Boxes,
      roles: ["admin", "superadmin"],
    },
    {
      name: "Customers",
      path: "/customers",
      icon: Users,
      roles: ["admin", "superadmin"],
    },
    {
      name: "Settings",
      path: "/settings",
      icon: Settings,
      roles: ["superadmin"],
    },
  ];

  //  Filter menu based on user role
  const allowedMenu = menu.filter((item) => item.roles.includes(user.role));

  return (
    <aside
      className={`bg-[#c5d5b6] h-[calc(100vh-56px)] mt-2 md:mt-0 
        fixed md:static top-14 left-0 z-40 overflow-y-auto transition-all duration-300 
        ${isOpen ? "w-64" : "w-16"}
      `}
    >
      <nav className="space-y-1 px-2 py-6">
        {allowedMenu.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors hover:bg-[#A2D286] ${
                isActive
                  ? "bg-[#A2D286] font-semibold shadow text-white"
                  : "text-[#49951C]"
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-[#49951C]"
                }`}
              />
              <span className={`${isOpen ? "inline" : "hidden"} md:inline`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
