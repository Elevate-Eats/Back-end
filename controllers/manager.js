const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const shortid = require('shortid');
const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.showAllManager = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    const { search, limit } = req.query;
    db.query('SELECT * FROM users WHERE companyId = $1', [companyid], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch manager data' });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'manager not found' });
      }
      let managerData = results.rows.map((manager) => {
        const {
          id, name, phone, email, role, branchAccess,
        } = manager;
        return {
          id, name, phone, email, role, branchAccess,
        };
      });
      if (search) {
        managerData = managerData.filter((branch) => branch.name.toLowerCase().startsWith(
          search.toLowerCase(),
        ));
      }
      if (limit) {
        managerData = managerData.slice(0, Number(limit));
      }
      return res.status(200).json({
        error: false,
        message: 'manager data retrieved successfully',
        managerData,
      });
    });
  } catch (err) {
    console.log('showmanager Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to retrieve manager data' });
  }
  return console.log('showAllmanager controller executed');
};

exports.showSingleManager = async (req, res) => {
  try {
    const { id } = req.body;
    db.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch manager data' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'Manager not found' });
      }

      const {
        name, nickname, phone, email, role, branchAccess,
      } = results.rows[0];
      const managerData = {
        id, name, nickname, phone, email, role, branchAccess,
      };

      return res.status(200).json({
        error: false,
        message: 'Manager data retrieved successfully',
        managerData,
      });
    });
  } catch (err) {
    console.log('showBranch Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to retrieve branch data' });
  }
  return console.log('showSingleManager controller executed');
};

exports.deleteManager = async (req, res) => {
  try {
    const { id } = req.body;
    await db.query('DELETE FROM users WHERE id = $1 ', [id], (err) => {
      if (err) {
        console.log(err);
      }
      return res.status(200).json({
        error: false,
        message: 'Manager deleted',
      });
    });
  } catch (err) {
    console.log('deleteManager Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed delete Manager' });
  }
  return console.log('deleteManager controller executed');
};

// Helper for createManager

async function checkEmailExistence(email) {
  return new Promise((resolve, reject) => {
    db.query('SELECT email from users WHERE email = $1', [email], (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results.rows.length > 0);
      }
    });
  });
}

exports.createManager = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    const schema = Joi.object({
      name: Joi.string().required(),
      nickname: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      role: Joi.string().valid('general_manager', 'area_manager', 'store_manager').required(),
      email: Joi.string().email().required(),
      branchAccess: Joi.string().required(),
      password: Joi.string().min(8).required(),
      passwordConfirm: Joi.ref('password'),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      name, nickname, phone, role, email, branchAccess, password,
    } = value;
    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      return res.status(409).json({
        error: true,
        message: 'Email already used',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    await db.query('INSERT INTO users (name, nickname, email, password, role, phone, branchAccess, companyId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, nickname, email, hashedPassword, role, phone, branchAccess, companyid], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'failed to addManager',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Manager Added',
      });
    });
  } catch (err) {
    console.log('Add Manager Error');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed createManager' });
  }
  return console.log('createBranch controller executed');
};

exports.updateManager = async (req, res) => {
  try {
    const schema = Joi.object({
      id: Joi.number().required(),
      name: Joi.string().required(),
      nickname: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      role: Joi.string().valid('general_manager', 'area_manager', 'store_manager').required(),
      email: Joi.string().email().required(),
      branchAccess: Joi.string().required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      id, name, nickname, phone, role, email, branchAccess,
    } = value;
    checkEmailExistence(email);
    db.query('UPDATE users SET name = $2, nickname = $3, phone = $4, role = $5, email = $6, branchaccess = $7 WHERE id = $1', [id, name, nickname, phone, role, email, branchAccess], (err) => {
      if (err) {
        console.log(err);
      }
      return res.status(200).json({
        error: false,
        message: 'Manager updated',
      });
    });
  } catch (err) {
    console.log('updateManager Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed updateManager' });
  }
  return console.log('updateManager controller executed');
};
