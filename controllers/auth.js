const jwt = require('jsonwebtoken');
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
    console.log(req.body.email);
    console.log(req.body.password);
    const { apikey } = req.headers;

    if (apikey !== process.env.API_KEY) {
      return res.status(400).json({ error: 'true', message: 'API_KEY Invalid' });
    }

    const { email, password } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/;

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      return res.status(400).json({ error: 'true', message: 'Invalid email or password format' });
    }

    db.query('SELECT * FROM users WHERE email = $1', [email], async (err, results) => {
      if (!results) {
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
        // eslint-disable-next-line camelcase
        company_id,
        // eslint-disable-next-line camelcase
        branch_access,
      } = results.rows[0];
      const token = jwt.sign({
        id,
        email,
        role,
        // eslint-disable-next-line camelcase
        company_id,
        // eslint-disable-next-line camelcase
        branch_access,
      }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });

      console.log(`the token is ${token}`);

      const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
      };
      res.cookie('usersSave', token, cookieOptions);
      return res.status(200).json({
        error: false,
        message: 'Successful login',
        token,
        nickname,
      });
    });
  } catch (err) {
    console.log(err);
    console.log('Login handler Error');
    return res.status(501).json({
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
    name, email, branchAccess, password, nickname, companyId, role,
  } = user;
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users (name, nickname, email, password, role, branch_access, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', [name, nickname, email, password, role, branchAccess, companyId], (err, results) => {
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
    const {
      company, name, nickname, role, email, password, passwordConfirm,
    } = req.body;

    if (apikey !== process.env.API_KEY) {
      return res.status(400).json({ error: true, message: 'API_KEY Invalid' });
    }

    const passwordConfirmRegex = /^.{8,}$/;
    const nameRegex = /.+/;
    const nicknameRegex = /^.{1,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const roleRegex = /^(general_manager|area_manager|store_manager)$/;
    const passwordRegex = /^.{8,}$/;

    // Validation checks
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'true', message: 'invalid email format' });
    }
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: 'true', message: 'invalid password format' });
    }
    if (!nameRegex.test(name)) {
      return res.status(400).json({ error: 'true', message: 'invalid name format' });
    }
    if (!roleRegex.test(role)) {
      return res.status(400).json({ error: 'true', message: 'invalid role format' });
    }
    if (!passwordConfirmRegex.test(passwordConfirm)) {
      return res.status(400).json({ error: 'true', message: 'invalid passwordConfirm format' });
    }
    if (!nicknameRegex.test(nickname)) {
      return res.status(400).json({ error: 'true', message: 'invalid nickname format' });
    }
    // Check if the company name already exists
    const companyExists = await checkCompanyExistence(company);
    if (companyExists) {
      return res.status(503).json({
        error: true,
        message: 'Company name already used',
      });
    }

    // Insert new company
    const companyId = await insertCompany(company);

    // Check if the email is already used
    const emailExists = await checkEmailExistence(email);
    if (emailExists) {
      return res.status(503).json({
        error: true,
        message: 'Email already used',
      });
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
      return res.status(504).json({
        error: true,
        message: 'Passwords do not match',
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
