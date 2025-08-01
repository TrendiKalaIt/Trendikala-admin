const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // ⬅️ import cors
const connectDB = require('./config/mongodb');
const cloudinary = require('./config/cloudinary')
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB
connectDB();

//  Use cors middleware
app.use(cors({
  origin: 'http://localhost:5173',  // your frontend's origin
  credentials: true                // if you send cookies or auth headers
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
