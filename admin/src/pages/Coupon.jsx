import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Coupon = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({
    coupon_code: "",
    discount_type: "flat",
    discount_value: "",
    expiry_date: "",
    total_coupon_limit: 0,
    per_user_usage_limit: 1,
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch Coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) setCoupons(response.data.coupons);
    } catch (err) {
      console.error("Failed to fetch coupons", err);
      setCoupons([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        const { data } = await axios.put(
          `${BASE_URL}/api/coupons/${editingId}`,
          form,
          config
        );
        if (data.success) setMessage("Coupon updated successfully!");
      } else {
        const { data } = await axios.post(
          `${BASE_URL}/api/coupons`,
          form,
          config
        );
        if (data.success) setMessage("Coupon created successfully!");
      }

      setForm({
        coupon_code: "",
        discount_type: "flat",
        discount_value: "",
        expiry_date: "",
        total_coupon_limit: 0,
        per_user_usage_limit: 1,
      });
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
      console.error(err);
    }
    setLoading(false);
  };

  // Edit
  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      coupon_code: coupon.coupon_code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      expiry_date: coupon.expiry_date.split("T")[0],
      total_coupon_limit: coupon.total_coupon_limit,
      per_user_usage_limit: coupon.per_user_usage_limit,
    });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this coupon?")) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.delete(
        `${BASE_URL}/api/coupons/${id}`,
        config
      );
      if (data.success) fetchCoupons();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Coupon Management</h2>

      {message && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          {message}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-white p-4 rounded shadow space-y-4"
      >
        <div className="grid md:grid-cols-3 gap-4">
          {/* Coupon Code */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Coupon Code</label>
            <input
              type="text"
              placeholder="Enter code"
              className="border p-2 rounded"
              value={form.coupon_code}
              onChange={(e) =>
                setForm({ ...form, coupon_code: e.target.value.toUpperCase() })
              }
              required
            />
          </div>

          {/* Discount Type */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Discount Type</label>
            <select
              value={form.discount_type}
              onChange={(e) =>
                setForm({ ...form, discount_type: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="flat">Flat</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          {/* Discount Value */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Discount Value</label>
            <input
              type="number"
              placeholder="Enter value"
              className="border p-2 rounded"
              value={form.discount_value}
              onChange={(e) =>
                setForm({ ...form, discount_value: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Expiry Date */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Expiry Date</label>
            <input
              type="date"
              className="border p-2 rounded"
              value={form.expiry_date}
              onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
              required
            />
          </div>

          {/* Total Usage Limit */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Total Usage Limit</label>
            <input
              type="number"
              placeholder="0 = unlimited"
              className="border p-2 rounded"
              value={form.total_coupon_limit}
              onChange={(e) =>
                setForm({ ...form, total_coupon_limit: e.target.value })
              }
            />
          </div>

          {/* Per User Limit */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Per User Limit</label>
            <input
              type="number"
              placeholder="Times a user can use"
              className="border p-2 rounded"
              value={form.per_user_usage_limit}
              onChange={(e) =>
                setForm({ ...form, per_user_usage_limit: e.target.value })
              }
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-[#A2D286] text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {editingId ? "Update Coupon" : "Add Coupon"}
        </button>
      </form>

      {/* Loading */}
      {loading && <p className="mb-2 text-gray-500">Loading...</p>}

      {/* Coupon Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Code</th>
              <th className="p-2">Type</th>
              <th className="p-2">Value</th>
              <th className="p-2">Expiry</th>
              <th className="p-2">Total Limit</th>
              <th className="p-2">Per User</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{coupon.coupon_code}</td>
                <td className="p-2">{coupon.discount_type}</td>
                <td className="p-2">{coupon.discount_value}</td>
                <td className="p-2">{coupon.expiry_date.split("T")[0]}</td>
                <td className="p-2">{coupon.total_coupon_limit}</td>
                <td className="p-2">{coupon.per_user_usage_limit}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => handleEdit(coupon)}
                    className="bg-yellow-400 px-2 py-1 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="bg-red-500 px-2 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupon;
