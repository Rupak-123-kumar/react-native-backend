const express = require('express');
const {
  checkIn,
  checkOut,
  getHistory,
  getTodayAttendance,   // ✅ ADD THIS
} = require('../controllers/attendanceController');

const router = express.Router();

// ✅ CHECK IN
router.post('/checkin', checkIn);

// ✅ CHECK OUT
router.post('/checkout', checkOut);

// ✅ ATTENDANCE HISTORY
router.get('/history/:userId', getHistory);

// ✅ TODAY ATTENDANCE (🔥 MISSING ROUTE)
router.get('/today/:userId', getTodayAttendance);

module.exports = router;
