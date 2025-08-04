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

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admins', adminRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running at :${PORT}`);
});
