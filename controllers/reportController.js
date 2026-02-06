const Attendance = require('../models/Attendance');

/**
 * MONTHLY REPORT
 * Returns present, absent, late count & percentage for a month
 */
exports.getMonthlyReport = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    // Example date format stored: YYYY-MM-DD
    const records = await Attendance.find({
      userId,
      date: { $regex: `^${year}-${month}` },
    });

    const totalDays = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;

    const attendancePercentage =
      totalDays === 0 ? 0 : Math.round((present / totalDays) * 100);

    res.json({
      userId,
      month,
      year,
      totalDays,
      present,
      absent,
      late,
      attendancePercentage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating monthly report', error });
  }
};

/**
 * SUMMARY REPORT
 * Returns lifetime attendance summary
 */
exports.getSummaryReport = async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await Attendance.find({ userId });

    const totalDays = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;

    const attendancePercentage =
      totalDays === 0 ? 0 : Math.round((present / totalDays) * 100);

    res.json({
      userId,
      totalDays,
      present,
      absent,
      late,
      attendancePercentage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error generating summary report', error });
  }
};
