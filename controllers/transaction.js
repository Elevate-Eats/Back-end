const Joi = require('joi');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.addTransaction = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    const schema = Joi.object({
      transactiondate: Joi.date().iso().required(),
      discount: Joi.number().allow(null),
      status: Joi.number().required(),
      paymentmethod: Joi.number().allow(null),
      totalprice: Joi.number().allow(null),
      branchid: Joi.number().required(),
      customername: Joi.string().allow('', null), // Allowing empty string and null
      tableNumber: Joi.number().allow(null),
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
      transactiondate,
      discount,
      status,
      paymentmethod,
      totalprice,
      branchid,
      customername,
      tableNumber,
    } = value;
    const result = await db.query(
      'INSERT INTO transactions (transactiondate, discount, status, paymentmethod, totalprice, branchid, customername, tablenumber, companyid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id',
      [
        transactiondate,
        discount,
        status,
        paymentmethod,
        totalprice,
        branchid,
        customername,
        tableNumber,
        companyid,
      ],
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

// To Update
exports.showTransactions = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    const schema = Joi.object({
      search: Joi.string(),
      limit: Joi.number(),
      branch: Joi.number(),
      transactionStatus: Joi.string(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      search, limit, branch, transactionStatus,
    } = value;
    let results;
    if (branch) {
      if (transactionStatus) {
        results = await db.query('SELECT * FROM transactions WHERE branchid = $1 AND status = $2', [branch, transactionStatus]);
      } else {
        results = await db.query('SELECT * FROM transactions WHERE branchid = $1', [branch]);
      }
    } else {
      results = await db.query('SELECT * FROM transactions WHERE companyid = $1', [companyid]);
    }
    let transactionData = results.rows.map((transaction) => {
      const {
        id,
        transactiondate,
        discount,
        status,
        paymentmethod,
        totalprice,
        branchid,
        customername,
        tableNumber,
      } = transaction;
      return {
        id,
        transactiondate,
        discount,
        status,
        paymentmethod,
        totalprice,
        branchid,
        customername,
        tableNumber,
      };
    });
    if (search) {
      transactionData = transactionData.filter((transaction) => transaction.customername
        .toLowerCase()
        .startsWith(
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

exports.showSingleTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const { id } = value;
    const result = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
    const {
      transactiondate,
      discount,
      status,
      paymentmethod,
      totalprice,
      branchid,
      customername,
      tableNumber,
    } = result.rows[0];
    const transactionData = {
      transactiondate,
      discount,
      status,
      paymentmethod,
      totalprice,
      branchid,
      customername,
      tableNumber,
    };
    return res.status(200).json({
      error: false,
      message: 'Transaction Data Retrieved',
      transactionData,
    });
  } catch (err) {
    console.log('showSingleTransaction Failed \n', err);
    return res.status(500).json({
      error: true,
      message: 'Failed to showSingleTransaction, Server Error',
    });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      transactiondate: Joi.date().iso().required(),
      discount: Joi.number().allow(null),
      status: Joi.number().required(),
      paymentmethod: Joi.number().allow(null),
      totalprice: Joi.number().allow(null),
      branchid: Joi.number().required(),
      customername: Joi.string().allow('', null), // Allowing empty string and null
      tableNumber: Joi.number().allow(null),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      transactiondate,
      discount,
      status,
      paymentmethod,
      totalprice,
      branchid,
      customername,
      tableNumber,
      id,
    } = value;
    await db.query(
      'UPDATE transactions SET transactiondate = $1, discount = $2, status = $3, paymentmethod = $4, totalprice = $5, branchid = $6, customername = $7, tablenumber = $8 WHERE id = $9',
      [
        transactiondate,
        discount,
        status,
        paymentmethod,
        totalprice,
        branchid,
        customername,
        tableNumber,
        id,
      ],
    );
    return res.status(200).json({
      error: false,
      message: 'Transaction Updated!',
      id,
    });
  } catch (err) {
    console.log('UpdateTransaction Failed \n', err);
    return res.status(500).json({
      error: true,
      message: 'Failed to updateTransaction, Server Error',
    });
  }
};
