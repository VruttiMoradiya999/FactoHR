const express = require('express');
const router = express.Router();
const {
    getEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeOverview
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/:id/overview', getEmployeeOverview);

router.use(authorize('admin'));

router.route('/').get(getEmployees).post(addEmployee);
router.route('/:id').put(updateEmployee).delete(deleteEmployee);

module.exports = router;
