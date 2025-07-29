import { useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const AutoLogoutHandler = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    // Auto logout after 30 minutes
    const timer = setTimeout(() => {
      logout();
    }, 30 * 60 * 1000); // 30 minutes

    // Check if page was refreshed (not a new tab or close)
    const navigationEntries = performance.getEntriesByType("navigation");
    const isRefresh =
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload";

    // Only clear token on tab/browser close (not refresh)
    const handleBeforeUnload = () => {
      if (!isRefresh) {
        localStorage.removeItem("token");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default AutoLogoutHandler;
