import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Trash2, Eye, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchEnquiries = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/enquiries`);
      setEnquiries(data);
    } catch (err) {
      console.error("Error fetching enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this enquiry?")) {
      try {
        await axios.delete(`${API_URL}/api/enquiries/${id}`);
        setEnquiries((prev) => prev.filter((e) => e._id !== id));
      } catch (err) {
        console.error("Error deleting enquiry:", err);
      }
    }
  };

  const handleView = (enquiry) => {
    setSelectedEnquiry(enquiry);
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/api/enquiries/${id}/status`,
        { isRead: newStatus }
      );
      setEnquiries((prev) => prev.map((enq) => (enq._id === id ? data : enq)));
    } catch (err) {
      console.error("Error updating enquiry status:", err);
    }
  };

  const handleSaveAction = async (enquiry) => {
    try {
      const { data } = await axios.patch(
        `${API_URL}/api/enquiries/${enquiry._id}/status`,
        {
          isRead: true,
          actionNote: enquiry.actionNote || "",
          actionDate: new Date(),
          finalized: true, 
        }
      );
      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === enquiry._id ? data : enq))
      );
      setSelectedEnquiry(null);
    } catch (err) {
      console.error("Error saving action:", err);
    }
  };

  const filteredEnquiries = enquiries.filter(
    (enq) =>
      enq.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enq.phone && enq.phone.includes(searchTerm))
  );

  if (loading) return <p className="p-4">Loading enquiries...</p>;

  return (
    <div className="font-dashboard p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#49951C]">Enquiries</h1>
        <div className="flex items-center border rounded-lg overflow-hidden w-full sm:w-64 mt-3 sm:mt-0">
          <input
            type="text"
            placeholder="Search enquiries..."
            className="px-3 py-2 outline-none flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="text-gray-500 mx-2" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-[#A2D286] text-gray-700">
            <tr>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Preferred Contact</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Action Taken</th>
              <th className="px-3 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Action Date</th>
              <th className="px-3 py-3 text-centre text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((enquiry) => (
                <tr
                  key={enquiry._id}
                  className={`font-body border-b transition ${
                    enquiry.isRead ? "bg-white" : "bg-yellow-50"
                  } hover:bg-gray-100`}
                >
                  <td className="p-3">{enquiry.fullName}</td>
                  <td className="p-3">{enquiry.email}</td>
                  <td className="p-3">{enquiry.phone || "—"}</td>
                  <td className="p-3">{enquiry.enquiryType}</td>
                  <td
                    className={`p-3 font-medium ${
                      enquiry.preferredContactMethod === "Email"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {enquiry.preferredContactMethod}
                  </td>
                  <td className="p-3 max-w-xs" title={enquiry.message}>
                    {enquiry.message.split(" ").slice(0, 4).join(" ") +
                      (enquiry.message.split(" ").length > 4 ? "..." : "")}
                  </td>
                  <td className="p-3">
                    {new Date(enquiry.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">
                    {enquiry.actionNote ? (
                      <span className="text-gray-700">
                        {enquiry.actionNote}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">
                        No action yet
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {enquiry.actionDate
                      ? new Date(enquiry.actionDate).toLocaleString()
                      : "—"}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleView(enquiry)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(enquiry._id)}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleToggleStatus(enquiry._id, !enquiry.isRead)
                      }
                      className={`p-2 rounded ${
                        enquiry.isRead
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-600"
                      } hover:opacity-80`}
                    >
                      {enquiry.isRead ? "✓ Read" : "Mark Read"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="p-4 text-center text-gray-500">
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedEnquiry && (
        <div className="font-body fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h2 className="text-xl font-semibold">Enquiry Details</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedEnquiry(null)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 overflow-y-auto">
              <p>
                <strong>Name:</strong> {selectedEnquiry.fullName}
              </p>
              <p>
                <strong>Email:</strong> {selectedEnquiry.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedEnquiry.phone || "—"}
              </p>
              <p>
                <strong>Type:</strong> {selectedEnquiry.enquiryType}
              </p>
              <p>
                <strong>Preferred Contact:</strong>{" "}
                {selectedEnquiry.preferredContactMethod}
              </p>

              <div className="mt-3">
                <strong>Message:</strong>
                <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto mt-1">
                  {selectedEnquiry.message}
                </div>
              </div>

              <div className="mt-3">
                <strong>Action Taken:</strong>
                <textarea
                  className="w-full border rounded p-2 mt-1"
                  rows="3"
                  placeholder="Enter action taken (e.g., Called customer, Sent email)..."
                  value={selectedEnquiry.actionNote || ""}
                  onChange={(e) =>
                    setSelectedEnquiry({
                      ...selectedEnquiry,
                      actionNote: e.target.value,
                    })
                  }
                  readOnly={!!selectedEnquiry.finalized} 
                />
                {selectedEnquiry.actionDate && (
                  <p className="text-sm text-gray-500 mt-2">
                    Updated on:{" "}
                    {new Date(selectedEnquiry.actionDate).toLocaleString()}
                  </p>
                )}
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Submitted on{" "}
                {new Date(selectedEnquiry.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 flex justify-between">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Close
              </button>
              <button
                onClick={() => handleSaveAction(selectedEnquiry)}
                className={`px-4 py-2 rounded text-white ${
                  selectedEnquiry.finalized
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                disabled={!!selectedEnquiry.finalized}
              >
                Save Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiry;
