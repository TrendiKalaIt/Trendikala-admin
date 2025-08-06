

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";




const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;

  

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("No token found");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const backendOrders = res.data.orders || res.data;

        const mapped = backendOrders.map((order) => ({
          id: `#ORD${order.orderId}`,
          date: new Date(order.createdAt).toLocaleString(),
          customer: order.user?.name || order.shippingInfo?.fullName || "Guest",
          paymentStatus:
            order.paymentStatus ||
            (order.paymentMethod === "Razorpay" ? "Paid" : "Pending"),
          orderStatus: order.orderStatus || order.status || "Pending",
          total: `₹${parseFloat(order.totalAmount).toFixed(2)}`,
          isGuest: order.isGuest,
          user: order.user,
          shippingInfo: order.shippingInfo,
        }));

        setOrders(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (index, field, value) => {
    const updated = [...orders];
    const orderId = updated[index].id.replace("#ORD", "");

    // Step 1: Optimistic UI update
    updated[index][field] = value;
    setOrders(updated);

    try {
      const token = localStorage.getItem("token");

      // Step 2: Send update to backend
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/status`,
        { orderStatus: value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optional: show success message
      console.log("Order status updated in backend");
    } catch (err) {
      console.error("Failed to update order status", err);

      // Rollback UI if needed
      const reverted = [...orders];
      reverted[index][field] = orders[index][field];
      setOrders(reverted);
    }
  };


  const toggleSelect = (id) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOrderClick = async (orderIdNumber) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderIdNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedOrderDetails(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch order details", err);
    }
  };

  const handleExport = () => {
    const exportData = orders.map(
      ({ id, date, isGuest, paymentStatus, orderStatus, total }) => ({
        ID: id,
        Date: date,
        Customer: isGuest ? "Guest" : "Registered",
        "Payment Status": paymentStatus,
        "Order Status": orderStatus,
        Total: total,
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "orders.xlsx");
  };


  const filteredOrders = orders.filter((order) => {
    const query = search.toLowerCase();
    return (
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.paymentStatus.toLowerCase().includes(query) ||
      order.orderStatus.toLowerCase().includes(query)
    );
  });


  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedOrders = filteredOrders.slice(start, start + pageSize);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading Orders...</div>;

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
         
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#e2ebdd] text-[#3a4d39]">
              <tr>
                
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
                  
                  <td
                    className="px-3 py-2 text-blue-600 font-medium cursor-pointer underline"
                    onClick={() =>
                      handleOrderClick(order.id.replace("#ORD", ""))
                    }
                  >
                    {order.id}
                  </td>
                  <td className="px-3 py-2">{order.date}</td>
                  <td className="px-3 py-2">
                    {/* {order.isGuest
                      ? `Guest`
                      : `Registered`} */}
                      {order.customer}
                  </td>
                  <td className="px-3 py-2">{order.paymentStatus}</td>
                  
                     
                  <td className="py-2">
                    {["Delivered", "Cancelled"].includes(order.orderStatus) ? (
                      <div className="flex items-center gap-1 text-gray-500">
                        <span>{order.orderStatus}</span>
                        <span title="Status locked">
                          {order.orderStatus === "Delivered" ? "✅" : "❌"}
                        </span>
                      </div>
                    ) : (
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(index, "orderStatus", e.target.value)
                        }
                        className="border rounded px-2 py-1"
                      >
                        {["Pending", "Shipped", "Delivered", "Cancelled"].map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>


                  <td className="px-3 py-2">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
                className={`px-3 py-1 border rounded text-sm ${currentPage === i + 1 ? "bg-green-600 text-white" : ""
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

      {/* Modal */}
      {isModalOpen && selectedOrderDetails && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full relative overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-green-700">
              OrderID: {selectedOrderDetails.orderId}
            </h2>

            <div className="mb-2">
              <p>
                <strong>Customer:</strong>{" "}
                {selectedOrderDetails.shippingInfo?.fullName || "Guest"}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                {selectedOrderDetails.shippingInfo?.emailAddress}
              </p>
              <p>
                <strong>Phone:</strong>{" "}
                {selectedOrderDetails.shippingInfo?.phoneNumber}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {selectedOrderDetails.shippingInfo?.streetAddress},{" "}
                {selectedOrderDetails.shippingInfo?.townCity}
              </p>
            </div>

            <h3 className="font-semibold mt-4 mb-2">Items:</h3>
            <ul className="divide-y">
              {selectedOrderDetails.items.map((item, idx) => (
                <li
                  key={idx}
                  className="py-2 flex gap-4 items-center"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p>
                      Qty: {item.quantity} | Size: {item.size} | Color:{" "}
                      {item.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{item.discountPrice}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 text-right font-semibold">
              Shipping: ₹{selectedOrderDetails.shippingCost.toFixed(2)} <br />
              Total: ₹{selectedOrderDetails.totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
