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
      branchId: Joi.number().min(1).required(),
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
    const { branchId, startDate, endDate } = value;
    let results;
    if (branchId && startDate && endDate) {
      results = await db.query('SELECT * FROM dailyanalytics WHERE branchId = $1 AND date >= $2 AND date <= $3 ORDER BY date ASC', [branchId, startDate, endDate]);
    } else if (branchId && startDate && !endDate) {
      results = await db.query('SELECT * FROM dailyanalytics WHERE branchId = $1 AND date >= $2 ORDER BY date ASC', [branchId, startDate]);
    } else if (branchId && !startDate && endDate) {
      // Only branchId and endDate are provided
      results = await db.query('SELECT * FROM dailyanalytics WHERE branchId = $1 AND date <= $2 ORDER BY date ASC', [branchId, endDate]);
    } else if (branchId && !startDate && !endDate) {
      // Only branchId is provided
      results = await db.query('SELECT * FROM dailyanalytics WHERE branchId = $1 ORDER BY date ASC', [branchId]);
    } else {
      return res.status(400).json({
        error: true,
        message: 'Missing or incorrect query parameters.',
      });
    }
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
      branchId: Joi.number().min(1).required(),
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
      branchId, startDate, endDate, menuId,
    } = value;
    let results;
    if (branchId && startDate && endDate && menuId) {
      results = await db.query('SELECT * FROM dailyitemanalytics WHERE branchId = $1 AND menuId = $4 AND date >= $2 AND date <= $3 ORDER BY date ASC', [branchId, startDate, endDate, menuId]);
    } else if (branchId && startDate && !endDate && menuId) {
      results = await db.query('SELECT * FROM dailyitemanalytics WHERE branchId = $1 AND menuId = $4 AND date >= $2 ORDER BY date ASC', [branchId, startDate, menuId]);
    } else if (branchId && !startDate && endDate && menuId) {
      results = await db.query('SELECT * FROM dailyitemanalytics WHERE branchId = $1 AND menuId = $4 AND date <= $2 ORDER BY date ASC', [branchId, endDate, menuId]);
    } else if (branchId && !startDate && !endDate && menuId) {
      results = await db.query('SELECT * FROM dailyitemanalytics WHERE branchId = $1 AND menuId = $2 ORDER BY date ASC', [branchId, menuId]);
    } else if (!branchId && menuId) {
      results = await db.query('SELECT * FROM dailyitemanalytics WHERE menuId = $1 ORDER BY date ASC', [menuId]);
    } else if (branchId && !startDate && !endDate && !menuId) {
      results = await db.query('SELECT * FROM dailyitemanalytics WHERE branchId = $1 ORDER BY date ASC', [branchId]);
    } else {
      return res.status(400).json({
        error: true,
        message: 'Missing or incorrect query parameters.',
      });
    }
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
