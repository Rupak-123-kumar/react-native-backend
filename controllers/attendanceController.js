const Attendance = require('../models/Attendance');

/* ================= CHECK IN ================= */
exports.checkIn = async (req, res) => {
  try {
    const { userId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ❌ prevent double check-in
    const existing = await Attendance.findOne({
      user: userId,
      date: { $gte: today },
    });

    if (existing) {
      return res.status(400).json({ message: 'Already checked in today' });
    }

    const now = new Date();

    const record = await Attendance.create({
      user: userId,
      date: now,
      status: 'Present',
      checkInTime: now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      checkOutTime: '--',
      workingHours: '0h',
    });

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Check-in failed' });
  }
};

/* ================= CHECK OUT ================= */
exports.checkOut = async (req, res) => {
  try {
    const { userId } = req.body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: today },
    });

    if (!attendance) {
      return res.status(400).json({ message: 'No check-in found' });
    }

    const now = new Date();

    attendance.checkOutTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    attendance.workingHours = '8h'; // 👉 later calculate dynamically

    await attendance.save();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Check-out failed' });
  }
};

/* ================= TODAY ATTENDANCE ================= */
exports.getTodayAttendance = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: today },
    });

    if (!attendance) {
      return res.json({
        status: 'Absent',
        checkInTime: '--',
        checkOutTime: '--',
        workingHours: '0h',
      });
    }

    res.json({
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      workingHours: attendance.workingHours,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ================= HISTORY ================= */
exports.getHistory = async (req, res) => {
  try {
    const history = await Attendance.find({
      user: req.params.userId,
    }).sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load history' });
  }
};
