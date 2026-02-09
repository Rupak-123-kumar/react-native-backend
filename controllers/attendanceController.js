const Attendance = require('../models/Attendance');

/* ================= CHECK IN ================= */
exports.checkIn = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const today = new Date().toISOString().split('T')[0];

    const existing = await Attendance.findOne({
      user: userId,
      date: today,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const record = await Attendance.create({
      user: userId,
      date: today,
      status: 'Present',
      checkInTime: new Date(),
      checkOutTime: null,
      workingMinutes: 0,
    });

    return res.status(201).json({
      message: 'Check-in successful',
      attendance: record,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    return res.status(500).json({ message: 'Check-in failed' });
  }
};

/* ================= CHECK OUT ================= */
exports.checkOut = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({
      user: userId,
      date: today,
    });

    if (!attendance || !attendance.checkInTime) {
      return res.status(400).json({ message: 'No check-in found for today' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({ message: 'Already checked out' });
    }

    const now = new Date();
    const minutes = Math.max(
      Math.floor((now - attendance.checkInTime) / 60000),
      0
    );

    attendance.checkOutTime = now;
    attendance.workingMinutes = minutes;
    await attendance.save();

    return res.json({
      message: 'Check-out successful',
      attendance,
    });
  } catch (error) {
    console.error('Check-out error:', error);
    return res.status(500).json({ message: 'Check-out failed' });
  }
};

/* ================= TODAY ATTENDANCE ================= */
exports.getTodayAttendance = async (req, res) => {
  try {
    const { userId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const attendance = await Attendance.findOne({
      user: userId,
      date: today,
    });

    return res.json(attendance || null);
  } catch (error) {
    console.error('Today attendance error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/* ================= HISTORY ================= */
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const history = await Attendance.find({ user: userId }).sort({ date: -1 });
    return res.json(history);
  } catch (error) {
    console.error('History error:', error);
    return res.status(500).json({ message: 'Failed to load history' });
  }
};
