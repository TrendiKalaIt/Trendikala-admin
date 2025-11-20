import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Tag, Calendar, User, Percent, DollarSign, Gauge, Code } from "lucide-react";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CouponDetail = () => {
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCouponDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${BASE_URL}/api/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setCoupon(data.coupon);
      } else {
        setError("Failed to load coupon details.");
      }
    } catch (err) {
      console.error("Failed to fetch coupon details", err);
      setError("Failed to connect to the server. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCouponDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 
              3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-600 font-semibold">
            Loading coupon details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-xl ">
          <p className="text-xl font-bold text-red-500">Error</p>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-xl ">
          <p className="text-xl font-bold text-gray-700">Coupon Not Found</p>
          <p className="mt-2 text-gray-500">
            The requested coupon could not be found.
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className=" mx-auto">
        {/* Title */}
        <div className="text-center mb-10 pt-5">
          <h1 className="text-3xl  font-heading text-green-500">
            Coupon Details
          </h1>
          <p className="mt-2 text-lg 
          font-body text-gray-500">
            An overview of the coupon's information and usage statistics.
          </p>
        </div>

        {/* Coupon Info */}
        <div className="bg-white p-6 md:p-8    ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Code */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <Code size={20} />
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Code</p>
                <p className="text-lg font-body font-bold text-gray-800">
                  {coupon.coupon_code}
                </p>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Type</p>
                <p className="text-lg font-body font-semibold text-gray-800 capitalize">
                  {coupon.discount_type}
                </p>
              </div>
            </div>

            {/* Value */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                {coupon.discount_type === "percentage" ? (
                  <Percent size={20} />
                ) : (
                  <DollarSign size={20} />
                )}
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Value</p>
                <p className="text-lg font-body font-semibold text-gray-800">
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount_value}%`
                    : `₹${coupon.discount_value}`}
                </p>
              </div>
            </div>

            {/* Expiry */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-full">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Expiry Date</p>
                <p className="text-lg font-body font-semibold text-gray-800">
                  {formatDate(coupon.expiry_date)}
                </p>
              </div>
            </div>

            {/* Total Limit */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                <Gauge size={20} />
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Total Limit</p>
                <p className="text-lg font-body font-semibold text-gray-800">
                  {coupon.total_coupon_limit}
                </p>
              </div>
            </div>

            {/* Per User Limit */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                <Gauge size={20} />
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Per User Limit</p>
                <p className="text-lg font-body font-semibold text-gray-800">
                  {coupon.per_user_usage_limit}
                </p>
              </div>
            </div>

            {/* Total Used */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Total Used</p>
                <p className="text-lg font-body font-semibold text-gray-800">
                  {coupon.total_coupon_used}
                </p>
              </div>
            </div>

            {/* Scope */}
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Tag size={20} />
              </div>
              <div>
                <p className="text-sm font-body text-gray-500">Scope</p>
                <p className="text-lg font-body font-semibold text-gray-800 capitalize">
                  {coupon.scope === "product" ? "Specific Product" : "Cart Total"}
                </p>
              </div>
            </div>

            {/* Applicable Product */}
            {coupon.scope === "product" && (
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full">
                  <Code size={20} />
                </div>
                <div>
                  <p className="text-sm font-body text-gray-500">Applicable Product</p>
                  <p className="text-lg font-body font-semibold text-gray-800">
                    {coupon.applicable_product?.productName || "N/A"}
                  </p>
                  {coupon.applicable_product?.productCode && (
                    <p className="text-md font-body text-gray-500">
                      Code: {coupon.applicable_product.productCode}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Slab Details */}
          {coupon.slabs && coupon.slabs.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-heading font-semibold text-green-500 mb-4">
                Price Slabs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {coupon.slabs.map((slab, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-2"
                  >
                    <p className="text-lg font-body font-semibold text-gray-800">
                      {slab.name || `Slab ${index + 1}`}
                    </p>
                    <p className="text-md font-body text-gray-600">
                      Amount Range: 
                      <span className="font-medium">
                        
                        ₹{slab.min_amount ?? 0} -
                        {slab.max_amount === null || slab.max_amount === undefined
                          ? " and above"
                          : ` ₹${slab.max_amount}`}
                      </span>
                    </p>
                    {slab.min_items > 0 && (
                      <p className="text-md font-body text-gray-600">
                        Min Items Required: {slab.min_items}
                      </p>
                    )}
                    <p className="text-md font-body text-gray-600">
                      Discount: 
                      {slab.discount_type === "percentage"
                        ? ` ${slab.discount_value || 0}%`
                        : ` ₹${slab.discount_value || 0}`}
                    </p>
                    <p className="text-md font-body text-gray-600">
                      Free Delivery: 
                      <span className="font-semibold">
                        {slab.free_delivery ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Used By Users */}
        <div className="bg-white p-6 ">
          <h3 className="text-2xl font-bold font-heading text-green-500 mb-4">
            Users Who Used This Coupon
          </h3>
          {coupon.coupon_used_by_users.length === 0 ? (
            <p className="text-gray-500 p-4 bg-gray-50 rounded-lg text-center">
              No users have used this coupon yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto border-separate border-spacing-y-2">
                <thead className="text-gray-500 uppercase text-sm font-body font-semibold">
                  <tr>
                    <th className="p-3 bg-gray-50 rounded-l-lg">User</th>
                    <th className="p-3 bg-gray-50">Email</th>
                    <th className="p-3 bg-gray-50">Order</th>
                    <th className="p-3 bg-gray-50 rounded-r-lg">Used At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupon.coupon_used_by_users.map((use, idx) => (
                    <tr
                      key={idx}
                      className="bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="p-3 font-medium text-gray-900 capitalize rounded-l-lg">
                        {use.user_id?.name || "N/A"}
                      </td>
                      <td className="p-3 text-gray-600">
                        {use.user_id?.email || "N/A"}
                      </td>
                      <td className="p-3 text-gray-600">
                        {use.order_id?._id || "N/A"}
                      </td>
                      <td className="p-3 text-gray-600 rounded-r-lg">
                        {new Date(use.usedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CouponDetail;
