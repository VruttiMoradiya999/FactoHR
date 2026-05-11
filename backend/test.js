const jwt = require('jsonwebtoken');
require('dotenv').config();

const test = async () => {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI);
    const User = require('./models/User');
    const admin = await User.findOne({ role: 'admin' });
    const emp = await User.findOne({ role: 'employee' });
    const realToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET);
    
    try {
        const response = await fetch(`http://127.0.0.1:5000/api/employees/${emp._id}/overview`, {
            headers: { Authorization: `Bearer ${realToken}` }
        });
        const data = await response.json();
        console.log("RESPONSE:", response.status, data.employee ? data.employee.name : data);
    } catch (e) {
        console.error("ERROR:", e);
    }
    process.exit();
}
test();
