const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
   const totalRevenueAgg = await Order.aggregate([
  { $match: { status: "paid" } },
  { $group: { _id: null, total: { $sum: "$totalAmount" } } }
]);

     const expectedRevenueAgg = await Order.aggregate([
  {
    $match: {
      status: "Processing",
       paymentMethod: "cashOnDelivery",
      orderStatus: { $in: ["pending", "shipped"] },
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$totalAmount" },
    },
  },
]);


    const totalRevenue = parseFloat((totalRevenueAgg[0]?.total || 0).toFixed(2));
    const expectedRevenue = parseFloat((expectedRevenueAgg[0]?.total || 0).toFixed(2));

    const totalCustomers = await User.countDocuments({}); 
    const totalProducts = await Product.countDocuments();

    const chartData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          orders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateFromParts: {
              year: "$_id.year",
              month: "$_id.month",
              day: "$_id.day",
            },
          },
          orders: 1,
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      chartData,
      expectedRevenue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
module.exports = { getDashboardStats };
