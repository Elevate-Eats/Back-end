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
    await db.query('INSERT INTO completeTransaction (transactionid) VALUES ($1)', [transactionId]);
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

exports.showdailysummary = async (req, res) => {
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
    const results = await db.query('SELECT * FROM dailyanalytics WHERE branchId = $1 AND date >= $2 AND date <= $3 ORDER BY date ASC', [branchId, startDate, endDate]);
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

exports.showitemssummary = async (req, res) => {
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
    const results = await db.query('SELECT * FROM dailyitemsanalytics WHERE branchId = $1 AND date >= $2 AND date <= $3 ORDER BY date ASC', [branchId, startDate, endDate]);
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
