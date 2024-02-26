const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const employeeController = require('../controllers/employee.js');

const router = express.Router();

router.get('/showEmployees', isLoggedIn, employeeController.showAllEmployee);
router.post('/showSingleEmployee', isLoggedIn, employeeController.showSingleEmployee);
router.post('/addEmployee', isLoggedIn, employeeController.createEmployee);
router.post('/deleteEmployee', isLoggedIn, employeeController.deleteEmployee);
router.post('/updateEmployee', isLoggedIn, employeeController.updateEmployee);

module.exports = router;
