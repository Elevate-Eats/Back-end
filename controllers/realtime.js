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
