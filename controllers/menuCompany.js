const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.addMenu = async (req, res) => {
  try {
    const authorizationHeader = res.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    const schema = Joi.object({
      name: Joi.string().min(1).required(),
      category: Joi.string().min(1).required(),
      basePrice: Joi.number().required(),
      baseOnlinePrice: Joi.number().required(),
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
      name, category, basePrice, baseOnlinePrice,
    } = value;
    await db.query('INSERT INTO menus (name, category, basePrice, baseOnlinePrice, companyId) VALUES ($1, $2, $3, $4, $5)', [name, category, basePrice, baseOnlinePrice, companyid], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'Failed to addMenu: DB Error',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Menu Added',
      });
    });
  } catch (err) {
    console.log('addProduct Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to add Product: Server Error' });
  }
  return console.log('addMenu Executed');
};
