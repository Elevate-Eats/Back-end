// Required Modules
const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Function helpers for menu operations
const { selectMenus } = require('../db/func/menuBranch/selectMenus');
const { selectSingleMenu } = require('../db/func/menuBranch/selectSingleMenu');
const { insertMenu } = require('../db/func/menuBranch/insertMenu');
const { updateMenu } = require('../db/func/menuBranch/updateMenu');
const { deleteMenu } = require('../db/func/menuBranch/deleteMenu');

// Controller for Adding a Menu to a Branch
exports.addMenu = async (req, res) => {
  try {
    // Decode CompanyId from JWT
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;

    // Validation
    const schema = Joi.object({
      name: Joi.string().min(1).required(),
      category: Joi.string().min(1).required(),
      basePrice: Joi.number().required(),
      baseOnlinePrice: Joi.number().required(),
      menuId: Joi.number().min(1).required(),
      branchId: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }

    // Insert MenuBranch to DB
    await insertMenu({ ...value, companyid });
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Create MenuBranch: Succeed',
    });
  } catch (err) {
    console.error('Create MenuBranch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create MenuBranch',
    });
  }
};

// Controller for Showing All Menus in a Branch
exports.showMenus = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      search: Joi.string().optional(),
      limit: Joi.number().optional(),
      branchid: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const { search, limit, branchid } = value;
    // Read from DB
    const menuData = await selectMenus(branchid, search, limit);
    // Not Found
    if (menuData.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'MenuBranch Data Fetch: No Data Found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'MenuBranch Data Fetch: Succeed',
      menuData,
    });
  } catch (err) {
    // Server Error
    console.error('Show MenuBranch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show MenuBranch',
    });
  }
};

// Controller for Showing a Single Menu in a Branch
exports.showSingleMenu = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      menuId: Joi.number().min(1).required(),
      branchId: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const { menuId, branchId } = value;
    // Read from DB
    const menuData = await selectSingleMenu(menuId, branchId);
    // Not Found
    if (!menuData) {
      return res.status(404).json({
        error: true,
        message: 'MenuBranch not found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'MenuBranch Data Fetch: Succeed',
      menuData,
    });
  } catch (err) {
    // Server Error
    console.error('Show Single MenuBranch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Single MenuBranch',
    });
  }
};

// Controller for Updating a Menu in a Branch
exports.updateMenu = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      menuId: Joi.number().min(1).required(),
      branchId: Joi.number().min(1).required(),
      name: Joi.string().min(1).required(),
      category: Joi.string().min(1).required(),
      basePrice: Joi.number().required(),
      baseOnlinePrice: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Update on DB
    await updateMenu(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Update MenuBranch: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Update MenuBranch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update MenuBranch',
    });
  }
};

// Controller for Deleting a Menu from a Branch
exports.deleteMenu = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      branchId: Joi.number().min(1).required(),
      menuId: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Delete from DB
    await deleteMenu(value.branchId, value.menuId);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Delete MenuBranch: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Delete MenuBranch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete MenuBranch',
    });
  }
};
