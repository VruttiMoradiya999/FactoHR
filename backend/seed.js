require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Attendance = require('./models/Attendance');
const Leave = require('./models/Leave');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Attendance.deleteMany({});
        await Leave.deleteMany({});
        console.log('Cleared existing data');

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: 'password',
            role: 'admin',
            department: 'IT',
            designation: 'Administrator',
        });
        console.log('✓ Admin created');

        // Create Demo Employees
        const employeeData = [
            { name: 'Demo Employee', email: 'employee@gmail.com', password: 'password', role: 'employee', department: 'Engineering', designation: 'Developer' },
            { name: 'Priya Patel', email: 'priya@company.com', password: 'password123', role: 'employee', department: 'Design', designation: 'Designer' },
            { name: 'Rohan Gupta', email: 'rohan@company.com', password: 'password123', role: 'employee', department: 'Engineering', designation: 'Engineer' },
            { name: 'Sneha Iyer', email: 'sneha@company.com', password: 'password123', role: 'employee', department: 'HR', designation: 'Manager' },
            { name: 'Vikram Desai', email: 'vikram@company.com', password: 'password123', role: 'employee', department: 'Marketing', designation: 'Analyst' },
            { name: 'Ananya Reddy', email: 'ananya@company.com', password: 'password123', role: 'employee', department: 'Engineering', designation: 'Developer' },
        ];

        const createdEmployees = [];
        for (const emp of employeeData) {
            const created = await User.create(emp);
            createdEmployees.push(created);
            console.log(`✓ Employee created: ${emp.name}`);
        }

        // Generate Attendance Data (Past 1 year)
        const today = new Date();
        const pastYear = new Date();
        pastYear.setFullYear(today.getFullYear() - 1);

        const allUsers = [admin, ...createdEmployees];

        let attendanceRecords = [];
        let leaveRecords = [];

        for (const user of allUsers) {
            let currentDate = new Date(pastYear);
            while (currentDate <= today) {
                // Skip weekends (0 = Sunday, 6 = Saturday)
                if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                    // 85% chance of being present, 10% chance of leave, 5% absent
                    const rand = Math.random();
                    const dateStr = currentDate.toISOString().split('T')[0];

                    if (rand < 0.85) {
                        attendanceRecords.push({
                            user: user._id,
                            date: dateStr,
                            status: 'Present',
                            timeIn: '09:00',
                            timeOut: '17:00'
                        });
                    } else if (rand < 0.95) {
                        // Create a leave record occasionally
                        if (Math.random() < 0.05) { // don't create too many overlapping leaves
                             leaveRecords.push({
                                user: user._id,
                                leaveType: Math.random() > 0.5 ? 'Sick Leave' : 'Casual Leave',
                                startDate: new Date(currentDate),
                                endDate: new Date(currentDate),
                                reason: 'Personal reasons',
                                status: 'Approved'
                            });
                        }
                        attendanceRecords.push({
                            user: user._id,
                            date: dateStr,
                            status: 'Absent'
                        });
                    } else {
                        attendanceRecords.push({
                            user: user._id,
                            date: dateStr,
                            status: 'Late',
                            timeIn: '10:30',
                            timeOut: '17:00'
                        });
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        await Attendance.insertMany(attendanceRecords);
        console.log(`✓ Inserted ${attendanceRecords.length} attendance records`);

        await Leave.insertMany(leaveRecords);
        console.log(`✓ Inserted ${leaveRecords.length} leave records`);

        console.log('\n=== Seeding Complete ===');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
