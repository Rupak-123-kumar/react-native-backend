const express = require('express');
const {
  getMonthlyReport,
  getSummaryReport,
} = require('../controllers/reportController');

const router = express.Router();

// Get monthly attendance report for a user
// /api/reports/monthly/:userId?month=02&year=2026
router.get('/monthly/:userId', getMonthlyReport);

// Get overall summary report for a user
// /api/reports/summary/:userId
router.get('/summary/:userId', getSummaryReport);

module.exports = router;
