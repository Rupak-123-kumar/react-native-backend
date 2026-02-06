const Attendance = require('../models/Attendance');

exports.checkIn = async (req, res) => {
  const record = await Attendance.create(req.body);
  res.json(record);
};

exports.checkOut = async (req, res) => {
  const record = await Attendance.findOneAndUpdate(
    { userId: req.body.userId, date: req.body.date },
    { checkOut: req.body.checkOut }
  );
  res.json(record);
};

exports.getHistory = async (req, res) => {
  const history = await Attendance.find({ userId: req.params.userId });
  res.json(history);
};
