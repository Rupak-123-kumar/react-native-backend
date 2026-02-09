const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect MongoDB
connectDB();

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));

// 🔥 ADD THIS (DASHBOARD ROUTE)
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// ================= ROOT ROUTE =================
app.get('/', (req, res) => {
  res.status(200).send('Attendance API is running 🚀');
});

// ================= PORT =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
