const Attendance = require('../models/Attendance');

/**
 * ===============================
 * 📅 MONTHLY REPORT
 * ===============================
 * Used by Reports screen
 */
exports.getMonthlyReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: 'Month and year are required',
      });
    }

    // YYYY-MM format
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;

    const records = await Attendance.find({
      user: userId,
      date: { $regex: `^${monthKey}` },
    }).sort({ date: 1 });

    const attendanceList = records.map(r => ({
      date: r.date,
      status: r.status,      // ✅ stored status
      late: r.isLate,        // ✅ correct late flag
    }));

    res.json({
      month: new Date(year, month - 1).toLocaleString('en-IN', {
        month: 'long',
        year: 'numeric',
      }),
      attendanceList,
    });
  } catch (error) {
    console.error('Monthly report error:', error);
    res.status(500).json({
      message: 'Error generating monthly report',
    });
  }
};

/**
 * ===============================
 * 📊 LIFETIME SUMMARY
 * ===============================
 * Optional (dashboard / admin)
 */
exports.getSummaryReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await Attendance.find({ user: userId });

    const attendanceList = records.map(r => ({
      date: r.date,
      status: r.status,
      late: r.isLate,
    }));

    res.json({
      totalDays: attendanceList.length,
      present: attendanceList.filter(r => r.status === 'Present').length,
      absent: attendanceList.filter(r => r.status === 'Absent').length,
      late: attendanceList.filter(r => r.late).length,
      attendanceList,
    });
  } catch (error) {
    console.error('Summary report error:', error);
    res.status(500).json({
      message: 'Error generating summary report',
    });
  }
};
