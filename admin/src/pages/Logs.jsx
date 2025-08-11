import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logsPerPage = 10;

  // Fetch logs from API
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error(`Failed to fetch logs: ${res.status}`);

      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error fetching logs");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Check if string is valid JSON
  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch {
      return false;
    }
  };

  // Delete single log
  const deleteLog = useCallback(
    async (id) => {
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
          setLogs((prev) => prev.filter((log) => log._id !== id));
        } else {
          toast.error("Failed to delete log");
        }
      } catch (err) {
        toast.error("Error deleting log");
      }
    },
    [setLogs]
  );

  // Clear all logs
  const clearAllLogs = useCallback(async () => {
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
        toast.error("Failed to clear logs");
      }
    } catch {
      toast.error("Error clearing logs");
    }
  }, []);

  // Filter logs by search term
  const filteredLogs = useMemo(() => {
    if (!searchTerm.trim()) return logs;
    const term = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.userName?.toLowerCase().includes(term) ||
        log.userRole?.toLowerCase().includes(term) ||
        log.action?.toLowerCase().includes(term)
    );
  }, [logs, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  // Format date/time display
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      }),
      time: date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  // Component: Single log row
  const LogRow = ({ log, index }) => {
    const { date, time } = formatDateTime(log.timestamp);
    return (
      <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
        <td className="px-4 py-3 text-center align-top">
          <button
            onClick={() => deleteLog(log._id)}
            className="text-red-500 hover:text-red-700 transition"
            title="Delete log"
            aria-label="Delete log"
          >
            <Trash2 size={18} />
          </button>
        </td>
        <td className="px-4 py-3 align-top whitespace-nowrap">
          <div className="font-medium">{date}</div>
          <div className="text-xs text-gray-500">{time}</div>
        </td>
        <td className="px-4 py-3 align-top">{log.userName || "-"}</td>
        <td className="px-4 py-3 align-top">{log.userRole || "-"}</td>
        <td className="px-4 py-3 align-top">{log.action || "-"}</td>
        <td className="px-4 py-3 align-top max-w-xs">
          {log.details ? (
            isValidJSON(log.details) ? (
              <pre
                className="whitespace-pre-wrap text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40 max-w-full"
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
              >
                {JSON.stringify(JSON.parse(log.details), null, 2)}
              </pre>
            ) : (
              <div className="text-sm text-gray-800">{log.details}</div>
            )
          ) : (
            "-"
          )}
        </td>
      </tr>
    );
  };

  // Component: Search bar + Clear button
  const SearchBar = () => (
    <div className="flex gap-2 flex-wrap justify-end items-center w-full sm:w-auto">
      <input
        type="text"
        placeholder="Search logs..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Search logs"
      />
      {logs.length > 0 && (
        <button
          onClick={clearAllLogs}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition"
          aria-label="Clear all logs"
          title="Clear all logs"
        >
          Clear All Logs
        </button>
      )}
    </div>
  );

  // Component: Pagination controls
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <nav
        aria-label="Pagination"
        className="flex justify-center mt-4 gap-2 flex-wrap"
      >
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 transition"
          aria-label="Previous page"
          title="Previous page"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 border rounded transition ${
              currentPage === i + 1
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-green-100"
            }`}
            aria-current={currentPage === i + 1 ? "page" : undefined}
            title={`Go to page ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 transition"
          aria-label="Next page"
          title="Next page"
        >
          Next
        </button>
      </nav>
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-full">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#49951C]">Activity Logs</h1>
        <SearchBar />
      </header>

      <section className="overflow-x-auto border rounded-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading logs...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">Error: {error}</div>
        ) : (
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-[#A2D286] text-green-700 uppercase text-xs tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center">Delete</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Action</th>
                <th className="px-4 py-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <LogRow key={log._id} log={log} index={index} />
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No activity logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </section>

      <Pagination />
    </div>
  );
};

export default Logs;
