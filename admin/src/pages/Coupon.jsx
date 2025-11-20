import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    scope: "cart",
    applicable_product: "",
    slabs: [
      {
        name: "Below 1000",
        min_amount: 0,
        max_amount: 999,
        min_items: 2,
        discount_type: "flat",
        discount_value: "",
        free_delivery: false,
      },
      {
        name: "1001 - 1500",
        min_amount: 1001,
        max_amount: 1500,
        min_items: 0,
        discount_type: "flat",
        discount_value: "",
        free_delivery: false,
      },
      {
        name: "1501 and above",
        min_amount: 1501,
        max_amount: null,
        min_items: 0,
        discount_type: "flat",
        discount_value: "",
        free_delivery: false,
      },
    ],
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [productLoading, setProductLoading] = useState(false);

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

  const fetchProducts = async () => {
    setProductLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data || []);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setProducts([]);
    }
    setProductLoading(false);
  };

  useEffect(() => {
    fetchCoupons();
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      coupon_code: "",
      discount_type: "flat",
      discount_value: "",
      expiry_date: "",
      total_coupon_limit: 0,
      per_user_usage_limit: 1,
      scope: "cart",
      applicable_product: "",
      slabs: [
        {
          name: "Below 1000",
          min_amount: 0,
          max_amount: 999,
          min_items: 2,
          discount_type: "flat",
          discount_value: "",
          free_delivery: false,
        },
        {
          name: "1001 - 1500",
          min_amount: 1001,
          max_amount: 1500,
          min_items: 0,
          discount_type: "flat",
          discount_value: "",
          free_delivery: false,
        },
        {
          name: "1501 and above",
          min_amount: 1501,
          max_amount: null,
          min_items: 0,
          discount_type: "flat",
          discount_value: "",
          free_delivery: false,
        },
      ],
    });
  };

  const handleSlabChange = (index, key, value) => {
    const updatedSlabs = [...form.slabs];
    updatedSlabs[index] = {
      ...updatedSlabs[index],
      [key]: value,
    };
    setForm({ ...form, slabs: updatedSlabs });
  };

  // Add/Update
  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...form };

    // 👇 IMPORTANT: product-scope coupon → slabs remove
  
    if (form.scope === "product") {
      payload.slabs = [];
      payload.free_delivery_product = form.free_delivery_product || false;
    }


    if (form.scope === "product" && !form.applicable_product) {
      setMessage("Please select a product for a product-scope coupon.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(`${BASE_URL}/api/coupons/${editingId}`, payload, config);
        setMessage("Coupon updated successfully!");
      } else {
        await axios.post(`${BASE_URL}/api/coupons`, payload, config);
        setMessage("Coupon created successfully!");
      }

      resetForm();
      setEditingId(null);
      fetchCoupons();
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
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
      scope: coupon.scope || "cart",
      applicable_product: coupon.applicable_product || "",
      slabs:
        coupon.slabs && coupon.slabs.length
          ? coupon.slabs
          : [
            {
              name: "Below 1000",
              min_amount: 0,
              max_amount: 999,
              min_items: 2,
              discount_type: "flat",
              discount_value: "",
              free_delivery: false,
            },
            {
              name: "1001 - 1500",
              min_amount: 1001,
              max_amount: 1500,
              min_items: 0,
              discount_type: "flat",
              discount_value: "",
              free_delivery: false,
            },
            {
              name: "1501 and above",
              min_amount: 1501,
              max_amount: null,
              min_items: 0,
              discount_type: "flat",
              discount_value: "",
              free_delivery: false,
            },
          ],
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
          <div className="flex flex-col">
            <label className="mb-1 font-semibold">Coupon Scope</label>
            <select
              value={form.scope}
              onChange={(e) =>
                setForm({
                  ...form,
                  scope: e.target.value,
                  applicable_product:
                    e.target.value === "product" ? form.applicable_product : "",
                })
              }
              className="border p-2 rounded"
            >
              <option value="cart">Cart Total</option>
              <option value="product">Specific Product</option>
            </select>
          </div>

          {form.scope === "product" && (
            <div className="flex flex-col">
              <label className="mb-1 font-semibold">Select Product</label>
              <select
                value={form.applicable_product}
                onChange={(e) =>
                  setForm({ ...form, applicable_product: e.target.value })
                }
                className="border p-2 rounded"
              >
                <option value="">
                  {productLoading ? "Loading products..." : "Select product"}
                </option>
                {products.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.productName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {form.scope === "product" && (
          <div className="border rounded p-3 space-y-3 bg-blue-50">
            <h3 className="font-semibold mb-2">Product Coupon Options</h3>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.free_delivery_product || false}
                onChange={(e) =>
                  setForm({ ...form, free_delivery_product: e.target.checked })
                }
              />
              <span className="text-sm font-medium">
                Free Delivery for this Product Coupon
              </span>
            </div>
          </div>
        )}

        <div className="border rounded p-3 space-y-3">
          <h3 className="font-semibold mb-2">Price Slabs Configuration</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {form.slabs.map((slab, index) => (
              <div
                key={index}
                className="border rounded p-3 space-y-2 bg-gray-50"
              >
                <div className="font-semibold text-sm">{slab.name}</div>
                <div className="text-xs text-gray-600">
                  Range: {slab.min_amount} -
                  {slab.max_amount === null ? "Above" : slab.max_amount}
                </div>
                {index === 0 && (
                  <div className="text-xs text-gray-600">
                    Min items: {slab.min_items} (for this slab to apply)
                  </div>
                )}
                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold">
                    Discount Type
                  </label>
                  <select
                    value={slab.discount_type}
                    onChange={(e) =>
                      handleSlabChange(index, "discount_type", e.target.value)
                    }
                    className="border p-1 rounded text-sm"
                  >
                    <option value="flat">Flat</option>
                    <option value="percentage">Percentage</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-xs font-semibold">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    className="border p-1 rounded text-sm"
                    value={slab.discount_value}
                    onChange={(e) =>
                      handleSlabChange(index, "discount_value", e.target.value)
                    }
                  />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="checkbox"
                    checked={!!slab.free_delivery}
                    onChange={(e) =>
                      handleSlabChange(index, "free_delivery", e.target.checked)
                    }
                  />
                  <span className="text-xs">Free Delivery for this slab</span>
                </div>
              </div>
            ))}
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
                <Link
                  to={`/coupons/${coupon._id}`}
                  className="underline font-semibold  text-blue-500"
                >
                  <td className="p-2">{coupon.coupon_code}</td>
                </Link>
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
