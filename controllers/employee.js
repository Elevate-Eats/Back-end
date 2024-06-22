// Required Module
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Required Function Helper
const { selectEmployees } = require('../db/func/employee/selectEmployees');
const { selectSingleEmployee } = require('../db/func/employee/selectSingleEmployee');
const { insertEmployee } = require('../db/func/employee/insertEmployee');
const { deleteEmployee } = require('../db/func/employee/deleteEmployee');
const { updateEmployeeBranch } = require('../db/func/employee/updateEmployee');
const { updateEmployee } = require('../db/func/employee/updateEmployee');

// Controller for show Employees
exports.showEmployees = async (req, res) => {
  try {
    // Decode CompanyId
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;

    // Validation
    const schema = Joi.object({
      search: Joi.string().optional(),
      limit: Joi.number().optional(),
      unassigned: Joi.number().optional(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Fetch Data
    const { search, limit, unassigned } = value;
    const employeeData = await selectEmployees(companyid, search, limit, unassigned);
    // If Not Found
    if (employeeData.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Employee Data Fetch: No Data Found',
      });
    }
    // If Succeed
    return res.status(200).json({
      error: false,
      message: 'Employee Data Fetch: Succeed',
      employeeData,
    });
  } catch (err) {
    // Server Error
    console.error('Show All Employees Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show All Employees',
    });
  }
};

// Controller for Show One Employee
exports.showSingleEmployee = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const { id } = value;
    const employeeData = await selectSingleEmployee(id);
    // Employee not found
    if (!employeeData) {
      return res.status(404).json({
        error: true,
        message: 'Employee not found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Employee Data Fetch: Succeed',
      employeeData,
    });
  } catch (err) {
    // Server Err
    console.error('Show Single Employee Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Single Employee',
    });
  }
};

// Insert Employee Controller
exports.createEmployee = async (req, res) => {
  try {
    // Decoding Company ID
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    // Validation
    const schema = Joi.object({
      name: Joi.string().min(1).required(),
      salary: Joi.number().required(),
      bonus: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Insert to DB
    await insertEmployee({ ...value, companyid });
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Create Employee: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Create Employee Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create Employee',
    });
  }
};

// Controller for Updating Employee
exports.updateEmployee = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().min(1).required(),
      salary: Joi.number().required(),
      bonus: Joi.number().required(),
      branchId: Joi.number().optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Update DB
    await updateEmployee(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Update Employee: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Update Employee Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Employee',
    });
  }
};

// Controller for Update Employee (branch only)
exports.updateEmployeesBranch = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      employeeIds: Joi.array().items(Joi.number().required()).required(),
      branchId: Joi.number().allow(null), // Allow 'null' for unassigning the employee
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const { employeeIds, branchId } = value;

    // Update DB
    await updateEmployeeBranch(employeeIds, branchId);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Update Employees Branch ID: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Update Employees Branch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Employees Branch',
    });
  }
};

// Controller for deleting Employee
exports.deleteEmployee = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }

    const { id } = value;
    // Deleting Employee in DB
    await deleteEmployee(id);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Delete Employee: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Delete Employee Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Employee',
    });
  }
};
