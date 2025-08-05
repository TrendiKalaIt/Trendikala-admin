import React, { useState, useEffect, useMemo } from "react";
import { Trash2 } from "lucide-react";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 10;

  // Fetch Logs
  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error(`Failed to fetch logs: ${res.status} ${res.statusText}`);
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      } else {
        setLogs([]);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogs([]);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  const deleteLog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this log?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/logs/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setLogs((prevLogs) => prevLogs.filter((log) => log._id !== id));
      } else {
        console.error("Failed to delete log");
      }
    } catch (err) {
      console.error("Error deleting log:", err);
    }
  };

  const clearAllLogs = async () => {
    if (!window.confirm("Are you sure you want to clear ALL logs?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        setLogs([]);
      } else {
        console.error("Failed to clear logs");
      }
    } catch (err) {
      console.error("Error clearing logs:", err);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter(
      (log) =>
        log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userRole?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h1 className="text-2xl font-bold text-[#49951C]">Activity Logs</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          {logs.length > 0 && (
            <button
              onClick={clearAllLogs}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Clear All Logs
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border text-[#A2D286]">Delete</th>

              <th className="p-3 border text-[#A2D286]">Date</th>
              <th className="p-3 border text-[#A2D286]">User</th>
              <th className="p-3 border text-[#A2D286]">Role</th>
              <th className="p-3 border text-[#A2D286]">Action</th>
              <th className="p-3 border text-[#A2D286]">Details</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length > 0 ? (
              currentLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50">
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => deleteLog(log._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                  <td
                    className="p-3 border text-center align-middle"
                    style={{ minWidth: "130px" }}
                  >
                    <div style={{ whiteSpace: "nowrap" }}>
                      {new Date(log.timestamp).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "2-digit",
                      })}
                    </div>
                    <div>
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </td>

                  <td className="p-3 border">{log.userName}</td>
                  <td className="p-3 border">{log.userRole}</td>
                  <td className="p-3 border">{log.action}</td>
                  <td className="p-3 border">
                    {log.details ? (
                      isValidJSON(log.details) ? (
                        <pre className="whitespace-pre-wrap text-sm">
                          {JSON.stringify(JSON.parse(log.details), null, 2)}
                        </pre>
                      ) : (
                        log.details
                      )
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No activity logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Logs;
