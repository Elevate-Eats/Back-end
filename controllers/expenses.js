const Joi = require('joi');

const { insertExpense } = require('../db/func/expense/insertExpense');
const { updateExpense } = require('../db/func/expense/updateExpense');
const { selectExpenses } = require('../db/func/expense/selectExpenses');
const { selectSingleExpense } = require('../db/func/expense/selectSingleExpense');
const { deleteExpense } = require('../db/func/expense/deleteExpense');

exports.addExpense = async (req, res) => {
  try {
    // Validation
    const schema = Joi.object({
      name: Joi.string().required(),
      count: Joi.number().required(),
      date: Joi.date().required(),
      price: Joi.number().required(),
      notes: Joi.string().required(),
      total: Joi.number().required(),
      category: Joi.string().required(),
      branchId: Joi.string().required(),
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
    await insertExpense(value);
    // Succeed
    return res.status(200).json({
      error: false,
      message: 'addExpenses: Succeed',
    });
  } catch (err) {
    console.error('addExpenses Server Error:', err);
    return res.status(200).json({
      error: true,
      message: 'Server Error: Add Expenses',
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      count: Joi.number().required(),
      date: Joi.date().required(),
      price: Joi.number().required(),
      total: Joi.number().required(),
      notes: Joi.string().required(),
      category: Joi.string().required(),
      branchId: Joi.string().required(),
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
    await updateExpense(value);
    return res.status(200).json({
      error: false,
      message: 'updateExpenses: Succeed',
    });
  } catch (err) {
    console.error('updateExpenses Server Error:', err);
    return res.status(200).json({
      error: true,
      message: 'Server Error: Update Expenses',
    });
  }
};

exports.showExpenses = async (req, res) => {
  try {
    const schema = Joi.object({
      branchId: Joi.number().required(),
      search: Joi.string().optional(),
      limit: Joi.number().optional(),
      date: Joi.date().iso().optional(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      search, limit, branchId, date,
    } = value;
    const expenses = await selectExpenses(search, limit, branchId, date);
    if (!expenses[0]) {
      return res.status(404).json({
        error: true,
        message: 'Expense not found',
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Expenses data fetch: Succeed',
      expenses,
    });
  } catch (err) {
    console.error('Show Expenses Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Expenses',
    });
  }
};

exports.showSingleExpense = async (req, res) => {
  try {
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
    const expense = await selectSingleExpense(value.id);
    if (!expense) {
      return res.status(404).json({
        error: true,
        message: 'Expense not found',
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Single Expense data fetch: Succeed',
      expense,
    });
  } catch (err) {
    console.error('Show Single Expense Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Show Single Expense',
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
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
    await deleteExpense(value.id);
    return res.status(200).json({
      error: false,
      message: 'Expense deleted successfully',
    });
  } catch (err) {
    console.error('Delete Expense Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Delete Expense',
    });
  }
};
