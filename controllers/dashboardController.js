const Attendance = require('../models/Attendance');

exports.getDashboard = async (req, res) => {
  try {
    const { userId } = req.params;

    const presentCount = await Attendance.countDocuments({
      user: userId,
      status: 'Present',
    });

    const absentCount = await Attendance.countDocuments({
      user: userId,
      status: 'Absent',
    });

    const lateCount = await Attendance.countDocuments({
      user: userId,
      status: 'Late',
    });

    const total = presentCount + absentCount + lateCount;
    const percentage =
      total === 0 ? 0 : Math.round((presentCount / total) * 100);

    res.json({
      presentCount,
      absentCount,
      lateCount,
      percentage,
      hours: '7h 20m',   // later dynamic
      status: 'Present' // later dynamic
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Dashboard fetch failed' });
  }
};
