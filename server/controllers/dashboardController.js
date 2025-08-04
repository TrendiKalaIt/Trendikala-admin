// const Order = require('../models/Order');
// const Product = require('../models/Product');

// exports.getDashboardRevenue = async (req, res) => {
//     try {
//       // 1. Total Revenue: All Paid Orders
//       const paidAgg = await Order.aggregate([
//         { $match: { paymentStatus: "Paid" } },
//         { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
//       ]);
//       const totalRevenue = paidAgg[0]?.totalRevenue || 0;

//       // 2. Expected Revenue: Unpaid + Not Cancelled
//       const expectedAgg = await Order.aggregate([
//         {
//           $match: {
//             paymentStatus: { $ne: "Paid" },
//             orderStatus: { $ne: "Cancelled" }
//           }
//         },
//         { $group: { _id: null, expectedRevenue: { $sum: "$totalAmount" } } }
//       ]);
//       const expectedRevenue = expectedAgg[0]?.expectedRevenue || 0;

//       // 3. Total Orders
//       const totalOrders = await Order.countDocuments();

//       // 4. Total Products
//       const totalProducts = await Product.countDocuments();

//       res.status(200).json({ totalRevenue, expectedRevenue, totalOrders, totalProducts });
//     } catch (error) {
//       console.error("Dashboard revenue fetch error:", error);
//       res.status(500).json({ message: "Server error" });
//     }
//   };




const Order = require('../models/Order');
const Product = require('../models/Product');

exports.getDashboardRevenue = async (req, res) => {
  try {
    // 1. Total Revenue: All Paid Orders
    const paidAgg = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = paidAgg[0]?.totalRevenue || 0;

    // 2. Expected Revenue: Unpaid + Not Cancelled
    const expectedAgg = await Order.aggregate([
      {
        $match: {
          paymentStatus: { $ne: "Paid" },
          orderStatus: { $ne: "Cancelled" }
        }
      },
      { $group: { _id: null, expectedRevenue: { $sum: "$totalAmount" } } }
    ]);
    const expectedRevenue = expectedAgg[0]?.expectedRevenue || 0;

    // 3. Total Orders
    const totalOrders = await Order.countDocuments();

    // 4. Total Products
    const totalProducts = await Product.countDocuments();

    // 5. Chart Data: Daily order count
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
      totalRevenue,
      expectedRevenue,
      totalOrders,
      totalProducts,
      chartData,
    });
  } catch (error) {
    console.error("Dashboard revenue fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
