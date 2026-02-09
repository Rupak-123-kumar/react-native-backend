const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // 🔑 IMPORTANT: normalized date
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },

    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      default: 'Present',
    },

    checkInTime: {
      type: Date,
    },

    checkOutTime: {
      type: Date,
    },

    workingMinutes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
