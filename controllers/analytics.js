const Joi = require('joi');
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.recordTransaction = async (req, res) => {
  try {
    const schema = Joi.object({
      transactionId: Joi.number().min(1).required(),
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
      transactionId,
    } = value;
    await db.query('INSERT INTO completetransactions (transactionid) VALUES ($1)', [transactionId]);
    return res.status(200).json({
      error: false,
      message: 'Transaction Recorded successfully',
    });
  } catch (err) {
    console.log('recordTransaction Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to record Transaction, Server Error' });
  }
};

exports.showDailySummary = async (req, res) => {
  try {
    const schema = Joi.object({
      companyId: Joi.number(),
      branchId: Joi.number(),
      startDate: Joi.date(),
      endDate: Joi.date(),
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
      companyId, branchId, startDate, endDate,
    } = value;
    let conditions = 'WHERE companyid = $1';
    // eslint-disable-next-line prefer-const
    let parameters = [companyId];
    let count = 2; // for param query
    if (branchId) {
      conditions += ` AND branchId = $${count}`;
      parameters.push(branchId);
      count += 1;
    }
    if (startDate) {
      conditions += ` AND date >= $${count}`;
      parameters.push(startDate);
      count += 1;
    }
    if (endDate) {
      conditions += ` AND date <= $${count}`;
      parameters.push(endDate);
      count += 1;
    }
    const query = `SELECT * FROM dailyitemanalytics ${conditions} ORDER BY date ASC`;
    const results = await db.query(query, parameters);
    const data = results.rows.map((dailyAnalytics) => {
      const {
        id,
        date,
        companyid,
        branchid,
        totalsales,
        numberoftransactions,
        numberofitemssold,
      } = dailyAnalytics;
      return {
        id,
        date,
        companyid,
        branchid,
        totalsales,
        numberoftransactions,
        numberofitemssold,
      };
    });
    return res.status(200).json({
      error: false,
      message: 'DailyAnalytics data fetched',
      data,
    });
  } catch (err) {
    console.log('showDailyAnalytics Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to showDailyAnalytics, Server Error' });
  }
};

exports.showItemsSummary = async (req, res) => {
  try {
    const schema = Joi.object({
      companyId: Joi.number().min(1).required(),
      branchId: Joi.number(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      menuId: Joi.number().min(1).required(),
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
      companyId, branchId, startDate, endDate, menuId,
    } = value;
    let conditions = 'WHERE companyid = $1';
    // eslint-disable-next-line prefer-const
    let parameters = [companyId];
    let count = 2; //  param query

    if (branchId) {
      conditions += ` AND branchId = $${count}`;
      parameters.push(branchId);
      count += 1;
    }
    if (menuId) {
      conditions += ` AND menuId = $${count}`;
      parameters.push(menuId);
      count += 1;
    }
    if (startDate) {
      conditions += ` AND date >= $${count}`;
      parameters.push(startDate);
      count += 1;
    }
    if (endDate) {
      conditions += ` AND date <= $${count}`;
      parameters.push(endDate);
      count += 1;
    }

    const query = `SELECT * FROM dailyitemanalytics ${conditions} ORDER BY date ASC`;
    const results = await db.query(query, parameters);
    const data = results.rows.map((dailyAnalytics) => {
      const {
        id,
        date,
        companyid,
        branchid,
        menuid,
        numberofitemssold,
        totalsales,
      } = dailyAnalytics;
      return {
        id,
        date,
        companyid,
        branchid,
        menuid,
        numberofitemssold,
        totalsales,
      };
    });
    return res.status(200).json({
      error: false,
      message: 'DailyItemsAnalytics data fetched',
      data,
    });
  } catch (err) {
    console.log('showDailyAnalytics Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to showDailyAnalytics, Server Error' });
  }
};
