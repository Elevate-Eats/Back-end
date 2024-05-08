const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Required Func Helper
const { selectBranches } = require('../db/func/branch/selectBranch');
const { selectSingleBranch } = require('../db/func/branch/selectSingleBranch');
const { insertBranch } = require('../db/func/branch/insertBranch');
const { deleteBranch } = require('../db/func/branch/deleteBranch');
const { checkIfBranchDeletable } = require('../db/func/branch/deleteBranch');
const { updateBranch } = require('../db/func/branch/updateBranch');

// Branch Controller for Showing All Branch
exports.showAllBranch = async (req, res) => {
  try {
    // Decode Company Id from JWT
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

    // Fetching Data on DB function
    const branchData = await selectBranches(companyid, search, limit);
    // If no branch was found
    if (branchData.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Branch Data Fetch: No Data Found',
      });
    }
    // Response if Succeed
    return res.status(200).json({
      error: false,
      message: 'Branch Data Fetch: Succeed',
      branchData,
    });
  } catch (err) {
    // IF There's Any Error on Server
    console.error('Show Branch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Branch',
    });
  }
};

// Branch Controller for Showing Single Branch
exports.showSingleBranch = async (req, res) => {
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

    // Data Fetch using DB Function Helper
    const branchData = await selectSingleBranch(id);
    // Response if Not found
    if (!branchData) {
      return res.status(404).json({
        error: true,
        message: 'Branch not found',
      });
    }
    // If Succeed
    return res.status(200).json({
      error: false,
      message: 'Branch data Fetch: Succeed',
      branchData,
    });
  } catch (err) {
    // IF There's Any Error on Server
    console.error('Show Single Branch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Single Branch',
    });
  }
};

// Branch Controller for Creating a Branch
exports.createBranch = async (req, res) => {
  try {
    // Decoding Company id from token
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    // Validation
    const schema = Joi.object({
      name: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      address: Joi.string().required(),
      managerId: Joi.optional(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }

    // Inserting Data
    await insertBranch({ ...value, companyid });
    // If Succeed
    return res.status(200).json({
      error: false,
      message: 'Create Branch: Succeed',
    });
  } catch (err) {
    // If Failed
    console.error('Create Branch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Create Branch',
    });
  }
};

// BranchController for deleting a Branch
exports.deleteBranch = async (req, res) => {
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
    // Check Employee
    const canDelete = await checkIfBranchDeletable(id);
    // If There's Employee
    if (canDelete) {
      return res.status(400).json({
        error: true,
        message: 'Delete Branch: Failed - Branch has active employees',
      });
    }
    // Deletion on DB
    await deleteBranch(id);
    // If Succeed
    return res.status(200).json({
      error: false,
      message: 'Delete Branch: Succeed',
    });
  } catch (err) {
    // If Error
    console.error('Delete Branch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Branch',
    });
  }
};

// BranchController for updating Branch
exports.updateBranch = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      address: Joi.string().required(),
      managerId: Joi.number().optional(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Updating on DB
    await updateBranch(value);
    // If Succeed
    return res.status(200).json({
      error: false,
      message: 'Update Branch: Succeed',
    });
  } catch (err) {
    // If Error
    console.error('Update Branch Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Branch',
    });
  }
};
