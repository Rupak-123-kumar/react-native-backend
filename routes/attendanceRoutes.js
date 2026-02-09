const express = require('express');
const router = express.Router();

const {
  checkIn,
  checkOut,
  getHistory,
  getTodayAttendance,
} = require('../controllers/attendanceController');

// ✅ MUST MATCH FRONTEND
router.post('/checkin', checkIn);
router.post('/checkout', checkOut);

// ✅ FETCH DATA
router.get('/today/:userId', getTodayAttendance);
router.get('/history/:userId', getHistory);

module.exports = router;
