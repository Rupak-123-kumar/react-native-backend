const Attendance = require('../models/Attendance');

/* ================= CHECK IN ================= */
exports.checkIn = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // 📅 normalized date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // ❌ prevent double check-in
    const existing = await Attendance.findOne({
      user: userId,
      date: today,
    });

    if (existing) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const now = new Date();

    const record = await Attendance.create({
      user: userId,
      date: today,
      status: 'Present',
      checkInTime: now,
      checkOutTime: null,
      workingMinutes: 0,
    });

    res.status(201).json({
      message: 'Check-in successful',
      attendance: record,
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Check-in failed' });
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

    // 🧮 calculate working minutes
    const diffMs = now - attendance.checkInTime;
    const minutes = Math.max(Math.floor(diffMs / 60000), 0);

    attendance.checkOutTime = now;
    attendance.workingMinutes = minutes;

    await attendance.save();

    res.json({
      message: 'Check-out successful',
      workingHours: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
      attendance,
    });
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ message: 'Check-out failed' });
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

    // ✅ IMPORTANT: return null if no record
    if (!attendance) {
      return res.json(null);
    }

    res.json({
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      workingHours: attendance.workingMinutes
        ? `${Math.floor(attendance.workingMinutes / 60)}h ${attendance.workingMinutes % 60}m`
        : '0h',
    });
  } catch (error) {
    console.error('Today attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= HISTORY ================= */
exports.getHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const history = await Attendance.find({ user: userId }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ message: 'Failed to load history' });
  }
};
