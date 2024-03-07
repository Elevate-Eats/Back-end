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
    const authorizationHeader = req.headers.authorization;
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
    db.query('INSERT INTO menus (name, category, basePrice, baseOnlinePrice, companyId) VALUES ($1, $2, $3, $4, $5)', [name, category, basePrice, baseOnlinePrice, companyid], (err) => {
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

exports.showMenus = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    const { search, limit } = req.query;
    db.query('SELECT * FROM menus WHERE companyid = $1', [companyid], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'Failed to showMenu',
        });
      }
      let menuData = result.rows.map((menu) => {
        const {
          id, name, category,
        } = menu;
        return {
          id, name, category,
        };
      });
      if (search) {
        menuData = menuData.filter((menu) => menu.name.tolowercase().startswith(
          search.tolowercase(),
        ));
      }
      if (limit) {
        menuData = menuData.slice(0, Number(limit));
      }
      return res.status(200).json({
        error: false,
        message: 'menuData retrieved successfully',
        menuData,
      });
    });
  } catch (err) {
    console.log('showMenus Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to show Menus: Server Error' });
  }
  return console.log('ShowMenus Executed');
};

exports.showSingleMenu = async (req, res) => {
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
    console.log(id);
    db.query('SELECT * FROM menus WHERE id = $1', [id], (err, results) => {
      if (err) {
        console.log('showSingleMenu ERROR', err);
        return res.status(500).json({
          err: true,
          message: 'Failed to retrieve menu',
        });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'Menu not found' });
      }
      const {
        name, category, basePrice, baseOnlinePrice,
      } = results.rows[0];
      const menuData = {
        name, category, basePrice, baseOnlinePrice,
      };
      return res.status(200).json({
        error: false,
        message: 'MenuData retrieved successfully',
        menuData,
      });
    });
  } catch (err) {
    console.log('showMenu Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to show Menu: Server Error' });
  }
  return console.log('showSingleMenu Executed');
};

exports.updateMenu = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.string().required(),
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
      id, name, category, basePrice, baseOnlinePrice,
    } = value;
    db.query('UPDATE menus SET name = $2, category = $3, basePrice = $4, baseOnlinePrice = $5 WHERE  id = $1', [id, name, category, basePrice, baseOnlinePrice], (err) => {
      if (err) {
        console.log(' updateMenus Failed, DATABASE Err');
        return res.status(500).json({
          error: true,
          message: 'Failed to Update',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Menu Updated!',
      });
    });
  } catch (err) {
    console.log('updateMenu Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to update Menu: Server Error' });
  }
  return console.log('updateMenus Executed');
};

exports.deleteMenus = async (req, res) => {
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
    db.query('DELETE FROM menus WHERE id = $1', [id], (err) => {
      if (err) {
        console.log('deleteMenu db Error');
        return res.status(500).json({
          error: true,
          message: 'Failed to deleteMenu',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Menu Deleted!',
      });
    });
  } catch (err) {
    console.log('deleteMenu Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to delete Menu: Server Error' });
  }
  return console.log('deleteMenus Executed');
};
