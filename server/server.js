const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const cors = require('cors'); // ⬅️ import cors
const connectDB = require('./config/mongodb');
const cloudinary = require('./config/cloudinary')
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const logRoutes = require("./routes/logRoutes");
const { protect } = require('./middleware/roleMiddleware');
const autoLogger = require('./middleware/autoLogger');



const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

//  Use cors middleware
app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.send('Trendikala Admin API is running');
});


app.use(express.json());


app.use("/api/auth", authRoutes);


// Routes
app.use("/api/logs",protect, logRoutes);
app.use('/api/orders',protect,autoLogger, orderRoutes);
app.use('/api/users',protect,autoLogger, userRoutes);
app.use('/api/products',protect,autoLogger, productRoutes);
app.use('/api/categories',protect,autoLogger, categoryRoutes);
app.use('/api/dashboard',protect,autoLogger, dashboardRoutes);
app.use('/api/admins',protect,autoLogger, adminRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running at :${PORT}`);
});
