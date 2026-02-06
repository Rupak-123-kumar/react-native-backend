const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  date: String,
  checkIn: String,
  checkOut: String,
  status: String,
});

module.exports = mongoose.model('Attendance', attendanceSchema);
