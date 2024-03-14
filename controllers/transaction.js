const Joi = require('joi');
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.addTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      transactiondate: Joi.string().required(),
      discount: Joi.number().required(),
      status: Joi.number().required(),
      paymentmethod: Joi.number().required(),
      totalprice: Joi.number().required(),
      branchid: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(204).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      transactiondate, discount, status, paymentmethod, totalprice, branchid,
    } = value;
    const result = await db.query(
      'INSERT INTO menus (transactiondate, discount, status, paymentmethod, totalprice, branchid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [transactiondate, discount, status, paymentmethod, totalprice, branchid],
    );
    const { id } = result.rows[0];
    return res.status(200).json({
      error: false,
      message: 'Transaction Added!',
      id,
    });
  } catch (err) {
    console.log('AddTransaction Failed \n', err);
    return res.status(500).json({
      error: true,
      message: 'Failed to addTransaction, Server Error',
    });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(204).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const { id } = value;
    await db.query('DELETE FROM transactions WHERE id = $1', [id]);
    return res.status(200).json({
      error: false,
      message: 'Transaction Deleted!',
    });
  } catch (err) {
    console.log('AddTransaction Failed \n', err);
    return res.status(500).json({
      error: true,
      message: 'Failed to addTransaction, Server Error',
    });
  }
};

exports.showTransactions = async (req, res) => {
  try {
    const schema = Joi.object({
      search: Joi.string().required(),
      limit: Joi.number.required(),
      branchid: Joi.number.required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(204).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      search, limit, branchid,
    } = value;
    const results = await db.query('SELECT * FROM transactions WHERE branchid = $1 AND status = "pending"', [branchid]);
    let transactionData = results.rows.map((transaction) => {
      const {
        id, transactiondate, discount, status, paymentmethod, totalprice,
      } = transaction;
      return {
        id, transactiondate, discount, status, paymentmethod, totalprice, branchid,
      };
    });
    if (search) {
      transactionData = transactionData.filter((branch) => branch.name.toLowerCase().startsWith(
        search.toLowerCase(),
      ));
    }
    if (limit) {
      transactionData = transactionData.slice(0, Number(limit));
    }
    return res.status(200).json({
      error: false,
      message: 'Transaction Data Retrieved Succesfully',
      transactionData,
    });
  } catch (err) {
    console.log('AddTransaction Failed \n', err);
    return res.status(500).json({
      error: true,
      message: 'Failed to ShowTransaction, Server Error',
    });
  }
};

exports.
