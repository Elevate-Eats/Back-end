const Joi = require('joi');
const moment = require('moment-timezone');

// Helper Function
const { insertCompleteTransaction } = require('../db/func/analytics/insertCompleteTransaction');
const { selectDailyAnalytics } = require('../db/func/analytics/selectDailyAnalytics');
const { selectHourlyAnalytics } = require('../db/func/analytics/selectHourlyAnalytics');
const { selectAdvancedHourlyAnalytics } = require('../db/func/analytics/selectAdvancedHourlyAnalytics');
const { selectDailyItemAnalytics } = require('../db/func/analytics/selectDailyItemAnalytics');
const { selectAdvancedAnalytics } = require('../db/func/analytics/selectAdvancedAnalytics');
const { selectAdvancedItemAnalytics } = require('../db/func/analytics/selectAdvancedItemAnalytics');
const { selectSummedExpenses } = require('../db/func/analytics/selectSummedExpense');

// Controller for Recording Transactions
exports.recordTransaction = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      transactionId: Joi.number().min(1).required(),
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
    await insertCompleteTransaction(value.transactionId);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Transaction Recorded: Succeed',
    });
  } catch (err) {
    // Server Error
    console.error('Record Transaction Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Record Transaction',
    });
  }
};

// Controller for Showing Daily Summary
exports.showDailySummary = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      companyId: Joi.number().required(),
      branchId: Joi.number(),
      startDate: Joi.date().iso(),
      endDate: Joi.date().iso(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false, convert: true });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation Errors',
        details: error.details.map((x) => x.message),
      });
    }
    if (value.startDate) {
      value.startDate = moment(value.startDate).startOf('day').toISOString();
    }
    if (value.endDate) {
      value.endDate = moment(value.endDate).endOf('day').toISOString();
    }
    // Read from DB
    const data = await selectDailyAnalytics(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Daily Analytics Data Fetched: Succeed',
      data,
    });
  } catch (err) {
    // Server Error
    console.error('Show Daily Summary Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Daily Summary',
    });
  }
};

// Controller for Showing Hourly Summary
exports.showHourlySummary = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      companyId: Joi.number().required(),
      branchId: Joi.number(),
      startDateTime: Joi.date().iso(),
      endDateTime: Joi.date().iso(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Read from DB
    const data = await selectHourlyAnalytics(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Hourly Analytics Data Fetched: Succeed',
      data,
    });
  } catch (err) {
    // Server Error
    console.error('Show Hourly Summary Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Hourly Summary',
    });
  }
};

// Controller for Showing Summed Hourly Summary
exports.showAdvancedHourlySummary = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      companyId: Joi.number().required(),
      branchId: Joi.number(),
      startDateTime: Joi.date().iso(),
      endDateTime: Joi.date().iso(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Read from DB
    const data = await selectAdvancedHourlyAnalytics(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Advanced Hourly Analytics Data Fetched: Succeed',
      data,
    });
  } catch (err) {
    // Server Error
    console.error('Show Advanced Hourly Summary Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Advanced Hourly Summary',
    });
  }
};

// Controller for Calculated Summary
exports.showAdvancedSummary = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      companyId: Joi.number().required(),
      branchId: Joi.number().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Read from DB
    const data = await selectAdvancedAnalytics(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Advanced Analytics Data Fetched: Succeed',
      data,
    });
  } catch (err) {
    // Server Error
    console.error('Advanced Analytics Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Advanced Analytics',
    });
  }
};

// Controller for Showing Items Summary
exports.showItemsSummary = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      companyId: Joi.number().required(),
      branchId: Joi.number().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      menuId: Joi.number().optional(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Read From DB
    const data = await selectDailyItemAnalytics(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Daily Items Analytics Data Fetched: Succeed',
      data,
    });
  } catch (err) {
    // Server Error
    console.error('Show Items Summary Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Items Summary',
    });
  }
};
// Controller for Advanced Item Summary
exports.showAdvancedItemsSummary = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      companyId: Joi.number().required(),
      branchId: Joi.number().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
      menuId: Joi.number().optional(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Read From DB
    const data = await selectAdvancedItemAnalytics(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Advanced Items Analytics Data Fetched: Succeed',
      data,
    });
  } catch (err) {
    // Server Error
    console.error('Advanced Items Summary Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Advanced Items Summary',
    });
  }
};

// Controller for Calculated Summary
exports.showAdvancedExpenses = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      branchId: Joi.number().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    // Read from DB
    const data = await selectSummedExpenses(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'Advanced Expenses Data Fetch: Succeed',
      data,
    });
  } catch (err) {
    // Server Error
    console.error('Advanced Expenses Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Sumemd Expenses',
    });
  }
};
