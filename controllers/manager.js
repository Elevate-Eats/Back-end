const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Required Function Helpers
const { selectManagers } = require('../db/func/manager/selectManagers.js');
const { selectSingleManager } = require('../db/func/manager/selectSingleManager');
const { insertManager } = require('../db/func/manager/insertManager');
const { deleteManager } = require('../db/func/manager/deleteManager');
const { updateManager } = require('../db/func/manager/updateManager');
const { checkEmail } = require('../db/func/manager/checkEmail');

// Controller for Showing All Managers
exports.showManagers = async (req, res) => {
  try {
    // Decoding CompanyId
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    // Validation
    const schema = Joi.object({
      search: Joi.string().optional(),
      limit: Joi.number().optional(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const { search, limit } = value;
    // Read from DB
    const managerData = await selectManagers(companyid, search, limit);
    // Not Found
    if (managerData.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Manager Data Fetch: No Data Found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Manager Data Fetch: Succeed',
      managerData,
    });
  } catch (err) {
    // Server Error
    console.error('Show All Managers Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show All Managers',
    });
  }
};

// Controller for Showing Single Manager
exports.showSingleManager = async (req, res) => {
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
    // Read from DB
    const managerData = await selectSingleManager(id);
    if (!managerData) {
      return res.status(404).json({
        error: true,
        message: 'Manager not found',
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Manager Data Fetch: Succeed',
      managerData,
    });
  } catch (err) {
    console.error('Show Single Manager Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Single Manager',
    });
  }
};

// Controller for Creating a Manager
exports.createManager = async (req, res) => {
  try {
    // Decoding company id
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    // Validation
    const schema = Joi.object({
      name: Joi.string().required(),
      nickname: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      role: Joi.string().valid('general_manager', 'area_manager', 'store_manager').required(),
      email: Joi.string().email().required(),
      branchAccess: Joi.string().required(),
      password: Joi.string().min(8).required(),
      passwordConfirm: Joi.ref('password'),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      name, nickname, phone, role, email, branchAccess, password,
    } = value;
    // Check Email
    const emailExists = await checkEmail(email);
    if (emailExists) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Email used',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    // Insert to DB
    await insertManager({
      name, nickname, email, password: hashedPassword, role, phone, branchAccess, companyid,
    });
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Create Manager: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Create Manager Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create Manager',
    });
  }
};

// Controller for Updating a Manager
exports.updateManager = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      nickname: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      role: Joi.string().valid('general_manager', 'area_manager', 'store_manager').required(),
      email: Joi.string().email().required(),
      branchAccess: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      id, name, nickname, phone, role, email, branchAccess,
    } = value;
    // Update on DB
    await updateManager({
      id, name, nickname, phone, role, email, branchAccess,
    });
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Update Manager: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Update Manager Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Manager',
    });
  }
};

// Controller for Deleting a Manager
exports.deleteManager = async (req, res) => {
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
    // Delete on DB
    await deleteManager(id);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Delete Manager: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Delete Manager Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Manager',
    });
  }
};
