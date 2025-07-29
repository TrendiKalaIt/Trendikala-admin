import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const dummyOrders = [
  {
    id: "#12512B",
    date: "May 5, 4:20 PM",
    customer: "Tom Anderson",
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    total: "$49.90",
  },
  {
    id: "#12523C",
    date: "May 5, 4:15 PM",
    customer: "Jayden Walker",
    paymentStatus: "Pending",
    orderStatus: "Delivered",
    total: "$34.36",
  },
  {
    id: "#51232A",
    date: "May 5, 4:15 PM",
    customer: "Inez Kim",
    paymentStatus: "Paid",
    orderStatus: "Pending",
    total: "$5.51",
  },
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `#ORD${1000 + i}`,
    date: "May 5, 4:00 PM",
    customer: `Customer ${i + 1}`,
    paymentStatus: ["Paid", "Pending", "Failed"][i % 3],
    orderStatus: ["Pending", "Shipped", "Delivered", "Cancelled"][i % 4],
    total: `$${(Math.random() * 100).toFixed(2)}`,
  })),
];

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "delivered":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "failed":
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "shipped":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Orders = () => {
  const [orders, setOrders] = useState(dummyOrders);
  const [selectedRows, setSelectedRows] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const userRole = "admin";

  const handleStatusChange = (index, field, value) => {
    const updated = [...orders];
    updated[index][field] = value;
    setOrders(updated);
  };

  const toggleSelect = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredOrders = orders.filter((order) =>
    order.customer.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(start, start + pageSize );

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleExport = () => {
    const exportData = orders.map(({ id, date, customer, paymentStatus, orderStatus, total }) => ({
      ID: id,
      Date: date,
      Customer: customer,
      "Payment Status": paymentStatus,
      "Order Status": orderStatus,
      Total: total,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "orders.xlsx");
  };

  return (
    
    <div className="p-6 bg-[#f5f9ef] min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-[#49951C]">Orders</h1>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Export
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        {/* Search & Delete */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <div className="space-x-2">
            <button className="p-2 rounded border hover:bg-gray-100 text-red-500">🗑</button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#e2ebdd] text-[#3a4d39]">
              <tr>
                <th className="px-3 py-2">
                  <input type="checkbox" />
                </th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Payment Status</th>
                <th className="px-3 py-2">Order Status</th>
                <th className="px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order, index) => (
                <tr key={order.id} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={!!selectedRows[order.id]}
                      onChange={() => toggleSelect(order.id)}
                    />
                  </td>
                  <td className="px-3 py-2 text-blue-600 font-medium">{order.id}</td>
                  <td className="px-3 py-2">{order.date}</td>
                  <td className="px-3 py-2">{order.customer}</td>

                  <td className="px-3 py-2">
                    <select
                      disabled={userRole !== "admin"}
                      className={`border px-2 py-1 rounded font-medium capitalize ${getStatusColor(
                        order.paymentStatus
                      )} ${userRole !== "admin" ? "opacity-60 cursor-not-allowed" : ""}`}
                      value={order.paymentStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          orders.findIndex((o) => o.id === order.id),
                          "paymentStatus",
                          e.target.value
                        )
                      }
                    >
                      <option>Paid</option>
                      <option>Pending</option>
                      <option>Failed</option>
                    </select>
                  </td>

                  <td className="px-3 py-2">
                    <select
                      disabled={userRole !== "admin"}
                      className={`border px-2 py-1 rounded font-medium capitalize ${getStatusColor(
                        order.orderStatus
                      )} ${userRole !== "admin" ? "opacity-60 cursor-not-allowed" : ""}`}
                      value={order.orderStatus}
                      onChange={(e) =>
                        handleStatusChange(
                          orders.findIndex((o) => o.id === order.id),
                          "orderStatus",
                          e.target.value
                        )
                      }
                    >
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </td>

                  <td className="px-3 py-2">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">{filteredOrders.length} Results</p>
          <div className="space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === i + 1 ? "bg-green-600 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-2 py-1 border rounded text-sm disabled:opacity-50"
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
