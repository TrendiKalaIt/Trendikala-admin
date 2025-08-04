import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import {
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Area,
} from "recharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [allChartData, setAllChartData] = useState([]);
  const [filteredChartData, setFilteredChartData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("Last 12 Hours");
  const [recentOrders, setRecentOrders] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        setDashboardData(data);

        const chartDataWithDates = (data.chartData || []).map((item) => ({
          ...item,
          date: new Date(item.date),
        }));
        setAllChartData(chartDataWithDates);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };


    const fetchRecentOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });


        const data = await res.json();

        // Adapt data to recentOrders format used in frontend
        const formattedOrders = data.slice(0, 7).map((order) => ({
          orderId: order.orderId,
          orderDate: new Date(order.createdAt).toLocaleDateString("en-IN"),
          customerName: order.shippingInfo.fullName,
          totalAmount: `₹${order.totalAmount}`,
          paymentStatus: order.paymentMethod === "Razorpay" ? "Paid" : "Pending",
          status: order.orderStatus,
        }));

        setRecentOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };


    fetchDashboardData();
    fetchRecentOrders();
  }, []);


  useEffect(() => {
    if (allChartData.length) {
      filterChartData(selectedRange);
    }
  }, [allChartData, selectedRange]);

  const filterChartData = (range) => {
    let fromTime;
    let toTime = new Date();

    if (range === "Custom") {
      fromTime = dateRange[0].startDate;
      toTime = dateRange[0].endDate;
    } else {
      const now = new Date();
      switch (range) {
        case "This Week":
          const day = now.getDay();
          const diff = now.getDate() - day + (day === 0 ? -6 : 1);
          fromTime = new Date(now.setDate(diff));
          fromTime.setHours(0, 0, 0, 0);
          break;
        case "Last Month":
          fromTime = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          now.setHours(23, 59, 59, 999);
          break;
        case "Total Orders":
          setFilteredChartData(allChartData);
          return;
        default:
          fromTime = new Date(0);
      }
    }

    const filtered = allChartData.filter((item) => {
      return item.date >= fromTime && item.date <= toTime;
    });

    setFilteredChartData(filtered);
  };

  if (!dashboardData) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4 space-y-6 bg-[#f5f9ef]">
      <h1 className="text-2xl font-bold font-dashboard text-[#49951C]">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Revenue", value: `₹${dashboardData.totalRevenue}` },
          { title: "Orders", value: dashboardData.totalOrders },
          { title: "Expected Revenue", value: `₹${dashboardData.expectedRevenue}` },
          { title: "Total Products", value: dashboardData.totalProducts },
        ].map((item, index) => (
          <div key={index} className="bg-white shadow rounded-lg p-4">
            <p className="text-gray-600">{item.title}</p>
            <h3 className="text-xl font-semibold text-[#A2D286]">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#49951C]">
            Orders Over Time
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <div className="flex items-center gap-2">
              <select
                value={selectedRange}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedRange(value);
                  if (value !== "Custom") {
                    setShowCalendar(false);
                  }
                }}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option>This Week</option>
                <option>Last Month</option>
                <option>Total Orders</option>
                <option>Custom</option>
              </select>

              {selectedRange === "Custom" && (
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="text-sm text-[#49951C] underline"
                >
                  {showCalendar ? "Hide Calendar" : "Select Dates"}
                </button>
              )}
            </div>

            {selectedRange === "Custom" && showCalendar && (
              <div className="z-50 bg-white p-2 rounded shadow-md">
                <DateRange
                  editableDateInputs={true}
                  onChange={(item) => {
                    setDateRange([item.selection]);
                  }}
                  moveRangeOnFirstSelection={false}
                  ranges={dateRange}
                  maxDate={new Date()}
                />
                <div className="flex justify-end mt-2">
                  <button
                    className="bg-[#49951C] text-white text-sm px-3 py-1 rounded"
                    onClick={() => {
                      filterChartData("Custom");
                      setShowCalendar(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filteredChartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3a4d39" />
                  <stop offset="30%" stopColor="#689f38" />
                  <stop offset="60%" stopColor="#8bc34a" />
                  <stop offset="100%" stopColor="#aed581" />
                </linearGradient>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a4d39" stopOpacity={0.5} />
                  <stop offset="50%" stopColor="#3a4d39" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3a4d39" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) =>
                  new Date(date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="orders"
                stroke="url(#lineGradient)"
                fill="url(#areaGradient)"
                strokeWidth={2}
                dot={{ r: 4, stroke: "#3a4d39", strokeWidth: 1 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[#3a4d39] mb-4">
          Recent Orders
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[#c5d5b6] text-[#3a4d39]">
              <tr>
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Payment</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{order.orderId}</td>
                  <td className="px-4 py-2">{order.orderDate}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.totalAmount}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === "Paid"
                        ? "bg-green-100 text-green-600"
                        : order.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${order.status === "Delivered"
                        ? "bg-green-100 text-green-600"
                        : order.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
