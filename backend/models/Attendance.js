const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late'],
        required: true,
    },
    timeIn: {
        type: String,
    },
    timeOut: {
        type: String,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Attendance', attendanceSchema);
