const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ['Present', 'Absent', 'Late'],
      required: true,
    },

    checkInTime: {
      type: String,
    },

    checkOutTime: {
      type: String,
    },

    workingMinutes: {
      type: Number, // e.g. 440 (7h 20m)
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
