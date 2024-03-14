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
    const itemSchema = Joi.object({
      count: Joi.number().min(1).required(),
      menuid: Joi.number().min(1).required(),
      branchprice: Joi.number().min(1).required(),
      totalprice: Joi.number().min(1).required(),
      transactionid: Joi.number().min(1).required(),
    });
    const schema = Joi.array().items(itemSchema).min(1).required();
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(204).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const insertPromises = value.map(({
      count, menuid, branchprice, totalprice, transactionid,
    }) => db.query(
      'INSERT INTO items (count, branchprice, totalprice, menuid, transactionid) VALUES ($1,$2,$3,$4,$5)',
      [count, menuid, branchprice, totalprice, transactionid],
    ));
    await Promise.all(insertPromises);
    return res.status(200).json({
      error: false,
      message: 'Items Added successfully',
    });
  } catch (err) {
    console.log('addItems Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to add Items, Server Error' });
  }
};
