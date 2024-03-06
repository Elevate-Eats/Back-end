const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

// const nodemailer = require('nodemailer');
// const shortid = require('shortid');

// Database Connection
const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

exports.login = async (req, res) => {
  try {
    const { apikey } = req.headers;
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
    });

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Validation error',
        details: error.details.map((x) => x.message),
      });
    }
    const { email, password } = value;
    if (apikey !== process.env.API_KEY) {
      return res.status(400).json({ error: 'true', message: 'API_KEY Invalid' });
    }
    db.query('SELECT * FROM users WHERE email = $1', [email], async (err, results) => {
      if (!results || results.rows.length === 0) {
        return res.status(404).json({
          error: true,
          message: 'Email not found',
        });
      }
      if (!await bcrypt.compare(password, results.rows[0].password)) {
        return res.status(501).json({
          error: true,
          message: 'Password incorrect',
        });
      }
      const {
        id,
        nickname,
        role,
        companyid,
        branchAccess,
      } = results.rows[0];
      const token = jwt.sign({
        id,
        email,
        role,
        companyid,
        branchAccess,
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      console.log(`the token is ${token}`);

      const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      };
      res.cookie('usersSave', token, cookieOptions);
      return res.status(202).json({
        error: false,
        message: 'Successful Login',
        token,
        nickname,
        id,
      });
    });
  } catch (err) {
    console.log(err);
    console.log('Login handler Error');
    return res.status(500).json({
      message: 'Server error for login',
      error: true,
    });
  }
  return console.log('Login Controller Executed');
};

// Helper for register
async function checkCompanyExistence(companyName) {
  return new Promise((resolve, reject) => {
    db.query('SELECT name from companies WHERE name = $1', [companyName], (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results.rows.length > 0);
      }
    });
  });
}

// Helper function to insert a new company and return its ID
async function insertCompany(companyName) {
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO companies (name) VALUES ($1)', [companyName], (err) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        db.query('SELECT id FROM companies WHERE name = $1', [companyName], (err2, results2) => {
          if (err2) {
            console.error(err2);
            reject(err2);
          } else {
            resolve(results2.rows[0].id);
          }
        });
      }
    });
  });
}

// Helper function to check if an email already exists
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

// Helper function to insert a new user
async function insertUser(user) {
  const {
    name, email, branchAccess, password, nickname, companyId, role, phone,
  } = user;
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users (name, nickname, email, password, role, phone, branchAccess, companyId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)', [name, nickname, email, password, role, phone, branchAccess, companyId], (err, results) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

exports.register = async (req, res) => {
  try {
    console.log(req.body);
    const { apikey } = req.headers;

    const schema = Joi.object({
      company: Joi.string().required(),
      name: Joi.string().required(),
      nickname: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      role: Joi.string().valid('general_manager', 'area_manager', 'store_manager').required(),
      email: Joi.string().email().required(),
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
      company, name, nickname, phone, role, email, password,
    } = value;
    if (apikey !== process.env.API_KEY) {
      return res.status(400).json({ error: true, message: 'API_KEY Invalid' });
    }

    // Check if the company name already exists
    const companyExists = await checkCompanyExistence(company);
    if (companyExists) {
      return res.status(409).json({
        error: true,
        message: 'Company name already used',
      });
    }

    // Insert new company
    const companyId = await insertCompany(company);

    // Check if the email is already used
    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      return res.status(409).json({
        error: true,
        message: 'Email already used',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert new user
    await insertUser({
      name,
      email,
      branchAccess: '{all}',
      password: hashedPassword,
      nickname,
      companyId,
      role,
      phone,
    });

    return res.status(200).json({
      error: false,
      message: 'Account registered',
    });
  } catch (err) {
    console.error(err);
    return res.status(501).json({
      message: 'Server error for register',
      error: true,
    });
  }
};
exports.isLoggedIn = async (req, res, next) => {
  try {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      db.query('SELECT * FROM users WHERE id = $1', [decoded.id], (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Internal Server Error',
            error: true,
          });
        }
        if (decoded.exp < Date.now() / 1000) {
          return res.status(501).json({
            message: 'Token Expired',
            error: true,
          });
        }
        if (!results || results.rows.length === 0) {
          return res.status(401).json({
            status: 'failed',
            message: 'Invalid token',
          });
        }
        next();
        return console.log('isLoggedIn checking user existence executed');
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(501).json({
      message: 'Authorization error',
      error: true,
    });
  }
  return console.log('IsLoggedIn middleware Executed');
};

exports.logout = (req, res) => {
  res.cookie('usersSave', 'logout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
    message: 'account logout',
  });
};
