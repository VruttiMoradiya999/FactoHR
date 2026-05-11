const Attendance = require('../models/Attendance');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
    const { status, timeIn, timeOut } = req.body;
    const date = new Date().toISOString().split('T')[0];

    try {
        let attendance = await Attendance.findOne({ user: req.user._id, date });

        if (attendance) {
            attendance.status = status || attendance.status;
            attendance.timeIn = timeIn || attendance.timeIn;
            attendance.timeOut = timeOut || attendance.timeOut;
            await attendance.save();
            res.json(attendance);
        } else {
            attendance = await Attendance.create({
                user: req.user._id,
                date,
                status,
                timeIn,
                timeOut,
            });
            res.status(201).json(attendance);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get attendance records
// @route   GET /api/attendance
// @access  Private
const getAttendanceRecords = async (req, res) => {
    try {
        const records = req.user.role === 'admin' 
            ? await Attendance.find().populate('user', 'name email department')
            : await Attendance.find({ user: req.user._id });
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { markAttendance, getAttendanceRecords };
