const Joi = require('joi');
const jwt = require('jsonwebtoken');

// Function helpers for menu operations
const { selectMenus } = require('../db/func/menuCompany/selectMenus');
const { selectSingleMenu } = require('../db/func/menuCompany/selectSingleMenu');
const { insertMenu } = require('../db/func/menuCompany/insertMenu');
const { updateMenu } = require('../db/func/menuCompany/updateMenu');
const { deleteMenu } = require('../db/func/menuCompany/deleteMenu');

// Controller to add a new menu
exports.addMenu = async (req, res) => {
  try {
    // Decoding CompanyId
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
    await insertMenu({ ...value, companyid });
    return res.status(200).json({
      error: false,
      message: 'Create Menu: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Create Menu Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create Menu',
    });
  }
};

// Controller to show all menus
exports.showMenus = async (req, res) => {
  try {
    // Decode companyId
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
    // Read on DB
    const menuData = await selectMenus(companyid, search, limit);
    // Not Found
    if (menuData.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Menu Data Fetch: No Data Found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Menu Data Fetch: Succeed',
      menuData,
    });
  } catch (err) {
    // Server Error
    console.error('Show Menus Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Menus',
    });
  }
};

// Controller to show a single menu
exports.showSingleMenu = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // DB read
    const menuData = await selectSingleMenu(value.id);
    // Not Found
    if (!menuData) {
      return res.status(404).json({
        error: true,
        message: 'Menu not found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Menu Data Fetch: Succeed',
      menuData,
    });
  } catch (err) {
    // Server Error
    console.error('Show Single Menu Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Single Menu',
    });
  }
};

// Controller to update a menu
exports.updateMenu = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().required(),
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
      message: 'Update Menu: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Update Menu Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Menu',
    });
  }
};

// Controller to delete a menu
exports.deleteMenus = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Delete on  DB
    await deleteMenu(value.id);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Delete Menu: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Delete Menu Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Menu',
    });
  }
};
