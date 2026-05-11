const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Leave = require('../models/Leave');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).lean();
        
        // Get attendance counts for all employees
        const attendanceCounts = await Attendance.aggregate([
            { $match: { status: { $in: ['Present', 'Late'] } } },
            { $group: { _id: '$user', count: { $sum: 1 } } }
        ]);
        const countMap = {};
        attendanceCounts.forEach(a => countMap[a._id.toString()] = a.count);

        const employeesWithAttendance = employees.map(emp => ({
            ...emp,
            daysAttended: countMap[emp._id.toString()] || 0
        }));

        res.json(employeesWithAttendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new employee
// @route   POST /api/employees
// @access  Private/Admin
const addEmployee = async (req, res) => {
    const { name, email, password, department, designation } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const employee = await User.create({
            name,
            email,
            password,
            department,
            designation,
            role: 'employee',
        });

        if (employee) {
            res.status(201).json(employee);
        } else {
            res.status(400).json({ message: 'Invalid employee data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private/Admin
const updateEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (employee) {
            employee.name = req.body.name || employee.name;
            employee.email = req.body.email || employee.email;
            employee.department = req.body.department || employee.department;
            employee.designation = req.body.designation || employee.designation;

            if (req.body.password) {
                employee.password = req.body.password;
            }

            const updatedEmployee = await employee.save();
            res.json(updatedEmployee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
const deleteEmployee = async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (employee) {
            await User.deleteOne({ _id: req.params.id });
            res.json({ message: 'Employee removed' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEmployeeOverview = async (req, res) => {
    try {
        if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Not authorized to view this profile' });
        }

        const employee = await User.findById(req.params.id).select('-password');
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const attendance = await Attendance.find({ user: req.params.id });
        const leaves = await Leave.find({ user: req.params.id });

        res.json({ employee, attendance, leaves });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeOverview,
};
