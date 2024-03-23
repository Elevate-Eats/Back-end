const Joi = require('joi');
const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.showItems = async (req, res) => {
  try {
    const schema = Joi.object({
      transactionId: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const { transactionId } = value;
    const results = await db.query('SELECT * FROM items WHERE transactionid = $1', [transactionId]);
    const itemData = results.rows.map((item) => {
      const {
        id, count, price, totalprice, menuid, category, pricingcategory,
      } = item;
      return {
        id, count, price, totalprice, menuid, transactionId, category, pricingcategory,
      };
    });
    return res.status(200).json({
      error: false,
      message: 'itemData Retrieved!',
      itemData,
    });
  } catch (err) {
    console.log('showItems Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to show Items, Server Error' });
  }
};
exports.addItems = async (req, res) => {
  try {
    const itemSchema = Joi.object({
      count: Joi.number().min(1).required(),
      menuid: Joi.number().min(1).required(),
      pricingcategory: Joi.string().required(),
      transactionid: Joi.number().min(1).required(),
      // price: Joi.number().min(1).required(),
      // totalprice: Joi.number().min(1).required(),
    });
    const schema = Joi.array().items(itemSchema).min(1).required();
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const insertPromises = value.map(({
      count, menuid, pricingcategory, transactionid,
    }) => db.query(
      'INSERT INTO items (count, menuid, pricingcategory, transactionid) VALUES ($1,$2,$3,$4)',
      [count, menuid, pricingcategory, transactionid],
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

exports.deleteItems = async (req, res) => {
  try {
    const schema = Joi.object({
      itemIds: Joi.array().items(Joi.number()),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const { itemIds } = value;
    const deletePromises = itemIds.map((id) => db.query('DELETE FROM items WHERE id = $1', [id]));
    await Promise.all(deletePromises);
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

exports.updateItems = async (req, res) => {
  try {
    const itemSchema = Joi.object({
      id: Joi.number().min(1).required(),
      count: Joi.number().min(1).required(),
      pricingcategory: Joi.string().required(),
      // price: Joi.number().min(1).required(),
      // totalprice: Joi.number().min(1).required(),
    });
    const schema = Joi.array().items(itemSchema).min(1).required();
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const updatePromises = value.map(({
      id, count, pricingcategory,
    }) => db.query(
      'UPDATE items SET count = $2, pricingcategory = $3 WHERE id = $1',
      [id, count, pricingcategory],
    ));
    await Promise.all(updatePromises);
    return res.status(200).json({
      error: false,
      message: 'Items Updated successfully',
    });
  } catch (err) {
    console.log('updateItems Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to update Items, Server Error' });
  }
};
