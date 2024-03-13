const Joi = require('joi');
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.addItems = async (req, res) => {
  try {
    const schema = Joi.object({
      count: Joi.number().min(1).required(),
      menuid: Joi.number().min(1).required(),
      transactionid: Joi.number().min(1).required(),
      branchid: Joi.number().min(1).required(),
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
      count, menuid, transactionid, branchid,
    } = value;
    const branchPrice = db.query('SELECT baseprice FROM menubranch WHERE branchid = $1 AND menuid = $2', [branchid, menuid], (err, result) => {
      if (err) {
        console.log('addItems DB Error');
        return res.status(500).json({
          error: true,
          message: 'addItems Error, Server DB Error',
        });
      }
      return result.rows[0];
    });
    const totalPrice = count * branchPrice;
    db.query('INSERT INTO items (count, branchprice, totalprice, menuid, transactionid) VALUES ($1,$2,$3,$4,$5)', [count, branchPrice, totalPrice, menuid, transactionid], (err) => {
      if (err) {
        console.log('addItems DB Error');
        return res.status(500).json({
          error: true,
          message: 'addItems Error, Server DB Error',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Items Added successfully',
      });
    });
  } catch (err) {
    console.log('addItems Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to add Items, Server Error' });
  }
  return console.log('addItems Executed');
};
