import React, { useEffect, useState } from "react";
import axios from "axios";
import { Eye, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/contact-messages`);
        setMessages(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact messages:", error);
        setLoading(false);
      }
    };
    fetchMessages();
  }, []);

  const handleView = async (msg) => {
    setSelectedMessage(msg);

    
    try {
      await axios.put(`${API_URL}/api/contact-messages/${msg._id}`, {
        visited: true,
      });
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, visited: true } : m))
      );
    } catch (error) {
      console.error("Error updating visit status:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-[#49951C]">Contact Enquiries</h1>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#A2D286] text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Message</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr
                key={msg._id}
                className={`border-t hover:bg-gray-50 transition ${
                   "bg-yellow-50" 
                }`}
              >
                <td className="py-3 px-4">{msg.name}</td>
                <td className="py-3 px-4">{msg.email}</td>
                <td className="py-3 px-4 truncate max-w-[200px]">
                  {msg.message}
                </td>
                <td className="py-3 px-4">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleView(msg)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 mx-auto"
                  >
                    <Eye size={16} /> View
                  </button>
                </td>
              </tr>
            ))}
            {messages.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-500 py-6 italic"
                >
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg relative">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Message Details</h2>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[300px] overflow-y-auto">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {selectedMessage.name}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {selectedMessage.email}
              </p>
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
              <div>
                <span className="font-medium">Message:</span>
                <p className="mt-1 whitespace-pre-line">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="border-t p-4 text-right">
              <button
                onClick={() => setSelectedMessage(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contact;
