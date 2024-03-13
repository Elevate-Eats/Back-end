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
    const schema = Joi.object({
      name: Joi.string().min(1).required(),
      category: Joi.string().min(1).required(),
      basePrice: Joi.number().required(),
      baseOnlinePrice: Joi.number().required(),
      menuId: Joi.number().min(1).required(),
      branchId: Joi.number().min(1).required(),
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
      name, category, basePrice, baseOnlinePrice, menuId, branchId,
    } = value;
    db.query('INSERT INTO menubranch (name, category, basePrice, baseOnlinePrice, menuid, branchid) VALUES ($1, $2, $3, $4, $5, $6)', [name, category, basePrice, baseOnlinePrice, menuId, branchId], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'Failed to addMenu, DB Error',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Menu Added successfully',
      });
    });
  } catch (err) {
    console.log('addProduct Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to add Product, Server Error' });
  }
  return console.log('addMenu Executed');
};

exports.showMenus = async (req, res) => {
  try {
    const { branchid } = req.body;
    const { search, limit } = req.body;
    db.query('SELECT * FROM menubranch WHERE branchid = $1', [branchid], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'Failed to showMenu',
        });
      }
      let menuData = result.rows.map((menu) => {
        const {
          menuid, name, category, baseprice, baseonlineprice,
        } = menu;
        return {
          menuid, branchid, name, category, baseprice, baseonlineprice,
        };
      });
      if (search) {
        menuData = menuData.filter((menu) => menu.name.toLowerCase().startsWith(
          search.toLowerCase(),
        ));
      }
      if (limit) {
        menuData = menuData.slice(0, Number(limit));
      }
      if (menuData.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'Menu not found',
        });
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
    return res.status(500).json({ error: true, message: 'Failed to show Menus, Server Error' });
  }
  return console.log('ShowMenus Executed');
};

exports.showSingleMenu = async (req, res) => {
  try {
    const schema = Joi.object({
      menuId: Joi.number().min(1).required(),
      branchId: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(204).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const { menuId, branchId } = value;
    db.query('SELECT * FROM menubranch WHERE menuId = $1 AND branchId = $2', [menuId, branchId], (err, results) => {
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
        menuid, branchid, name, category, baseprice, baseonlineprice,
      } = results.rows[0];
      const menuData = {
        menuid, branchid, name, category, baseprice, baseonlineprice,
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
    return res.status(500).json({ error: true, message: 'Failed to show Menu, Server Error' });
  }
  return console.log('showSingleMenu Executed');
};

exports.updateMenu = async (req, res) => {
  try {
    const schema = Joi.object({
      menuId: Joi.number().min(1).required(),
      branchId: Joi.number().min(1).required(),
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
      menuId, branchId, name, category, basePrice, baseOnlinePrice,
    } = value;
    db.query('UPDATE menubranch SET name = $3, category = $4, basePrice = $5, baseOnlinePrice = $6 WHERE  menuId = $1 AND branchId = $2', [menuId, branchId, name, category, basePrice, baseOnlinePrice], (err) => {
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
    return res.status(500).json({ error: true, message: 'Failed to update Menu, Server Error' });
  }
  return console.log('updateMenus Executed');
};

exports.deleteMenus = async (req, res) => {
  try {
    const schema = Joi.object({
      branchId: Joi.number().min(1).required(),
      menuId: Joi.number().min(1).required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(204).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const { branchId, menuId } = value;
    db.query('DELETE FROM menubranch WHERE branchId = $1 AND menuId = $2', [branchId, menuId], (err) => {
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
    return res.status(500).json({ error: true, message: 'Failed to delete Menu, Server Error' });
  }
  return console.log('deleteMenus Executed');
};
