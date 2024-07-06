const Joi = require('joi');
const jwt = require('jsonwebtoken');

const { insertTransaction } = require('../db/func/transaction/insertTransaction');
const { selectTransactions } = require('../db/func/transaction/selectTransaction');
const { selectSingleTransaction } = require('../db/func/transaction/selectSingleTransaction');
const { updateTransaction } = require('../db/func/transaction/updateTransaction');
const { deleteTransaction } = require('../db/func/transaction/deleteTransaction');

// Controller for Adding a Transaction
exports.addTransaction = async (req, res) => {
  try {
    // Decoding Company ID from token
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    // Validation
    const schema = Joi.object({
      transactiondate: Joi.date().iso().required(),
      discount: Joi.number().allow(null),
      status: Joi.number().required(),
      paymentmethod: Joi.number().allow(null),
      totalprice: Joi.number().allow(null),
      branchid: Joi.number().required(),
      customername: Joi.string().allow('', null),
      tableNumber: Joi.number().allow(null),
      cashierid: Joi.number(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Insert Transaction to DB
    const transactionId = await insertTransaction({ ...value, companyid });
    return res.status(200).json({
      error: false,
      message: 'Create Transaction: Succeed',
      id: transactionId,
    });
  } catch (err) {
    // Server Error
    console.error('Add Transaction Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Add Transaction',
    });
  }
};

// Controller for Deleting a Transaction
exports.deleteTransaction = async (req, res) => {
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
    // Delete on DB
    await deleteTransaction(value.id);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Delete Transaction: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Delete Transaction Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Transaction',
    });
  }
};

// Controller for Showing All Transactions
exports.showTransactions = async (req, res) => {
  try {
    // Decode CompanyId from JWT
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    // Validation
    const schema = Joi.object({
      search: Joi.string(),
      limit: Joi.number().integer().min(1).default(10),
      page: Joi.number().integer().min(1).default(1),
      branch: Joi.number(),
      status: Joi.string(),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso()
        .greater(Joi.ref('startDate'))
        .when('startDate', { is: Joi.exist(), then: Joi.required() }),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Calculate offset
    const offset = (value.page - 1) * value.limit;
    // Read from DB using helper function with pagination
    const transactions = await selectTransactions(companyid, value, offset);
    // Not Found
    if (transactions.length === 0) {
      return res.status(404).json({
        error: true,
        message: 'Transaction Data Fetch: No Transactions Found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Transaction Data Fetch: Succeed',
      transactions,
    });
  } catch (err) {
    // Server Error
    console.error('Show Transactions Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Transactions',
    });
  }
};

// Controller for Showing Single Transaction
exports.showSingleTransaction = async (req, res) => {
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
    // Read from DB
    const transaction = await selectSingleTransaction(value.id);
    // Not Found
    if (!transaction) {
      return res.status(404).json({
        error: true,
        message: 'Transaction Data Fetch: Not Found',
      });
    }
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Transaction Data Fetch: Succeed',
      transaction,
    });
  } catch (err) {
    // Server Error
    console.error('Show Single Transaction Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Single Transaction',
    });
  }
};

// Controller for Updating a Transaction
exports.updateTransaction = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      id: Joi.number().required(),
      transactiondate: Joi.date().iso().required(),
      discount: Joi.number().allow(null),
      status: Joi.number().required(),
      paymentmethod: Joi.number().allow(null),
      totalprice: Joi.number().allow(null),
      branchid: Joi.number().required(),
      customername: Joi.string().allow('', null),
      tableNumber: Joi.number().allow(null),
      cashierid: Joi.number().allow(),
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
    await updateTransaction(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Update Transaction: Succeed',
      id: value.id,
    });
  } catch (err) {
    // Server Error
    console.error('Update Transaction Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Update Transaction',
    });
  }
};
