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
app.use(cors());           // ✅ OK
app.use(express.json());   // ✅ MUST (present)

// ================= ROUTES =================
app.use('/api/auth', require('./routes/authRoutes'));        // ✅ OK
app.use('/api/attendance', require('./routes/attendanceRoutes')); // ✅ OK
app.use('/api/profile', require('./routes/profileRoutes'));  // ✅ OK
app.use('/api/reports', require('./routes/reportRoutes'));   // ✅ OK

// ================= ROOT ROUTE =================
app.get('/', (req, res) => {
  res.status(200).send('Attendance API is running 🚀'); // ✅ OK
});

// ================= PORT =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
