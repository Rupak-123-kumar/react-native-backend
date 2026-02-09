const express = require('express');
const {
  checkIn,
  checkOut,
  getHistory,
  getTodayAttendance,
} = require('../controllers/attendanceController');

const router = express.Router();

// ✅ CHECK IN
router.post('/check-in', checkIn);

// ✅ CHECK OUT
router.post('/check-out', checkOut);

// ✅ ATTENDANCE HISTORY
router.get('/history/:userId', getHistory);

// ✅ TODAY ATTENDANCE
router.get('/today/:userId', getTodayAttendance);

module.exports = router;
