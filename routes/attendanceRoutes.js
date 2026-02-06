const express = require('express');
const {
  checkIn,
  checkOut,
  getHistory,
} = require('../controllers/attendanceController');

const router = express.Router();

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/history/:userId', getHistory);

module.exports = router;
