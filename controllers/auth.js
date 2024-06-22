// auth.js: Controller for Auth API

// Required Dependencies
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

// DB Function
const { checkEmail } = require('../db/func/auth/checkEmail');
const { checkLogin } = require('../db/func/auth/checkLogin');
const { checkCompany } = require('../db/func/auth/checkCompany');
const { insertCompany } = require('../db/func/auth/insertCompany');
const { insertUser } = require('../db/func/auth/insertUser');
const { checkUserId } = require('../db/func/auth/checkUserId');
const { generateSignedUrl } = require('../utilities/image/getSignedUrl');

// For Forget Password (later)
// const nodemailer = require('nodemailer');
// const shortid = require('shortid');

// Login Controller
exports.login = async (req, res) => {
  try {
    const { apikey } = req.headers;
    // Checking API Key
    if (!apikey) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: API KEY not Found',
      });
    }
    if (apikey !== process.env.API_KEY) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Invalid API KEY',
      });
    }
    // Input Validation from Request
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

    // Checking Credentials
    const { valid, message, credentials } = await checkLogin(email, password);
    if (!valid) {
      return res.status(400).json({
        error: true,
        message,
      });
    }
    const {
      id,
      role,
      companyid,
      branchAccess,
      profilepicname,
    } = credentials;
    const profilePictureUrl = await generateSignedUrl('user-pic', profilepicname);
    console.log(profilePictureUrl);
    // Token Creation
    const token = jwt.sign({
      id,
      email,
      role,
      companyid,
      branchAccess,
    }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
    };
    res.cookie('usersSave', token, cookieOptions);

    // Success Response
    return res.status(200).json({
      error: false,
      message,
      token,
      credentials,
      profilePictureUrl,
    });
  } catch (err) {
    console.error('Login Server Error: ', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Login',
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { apikey } = req.headers;
    // Checking API Key
    if (!apikey) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: API KEY not Found',
      });
    }
    if (apikey !== process.env.API_KEY) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Invalid API KEY',
      });
    }

    // Input Validation from Request
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
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    const {
      company, name, nickname, phone, role, email, password,
    } = value;

    // Check if the company name already exists
    const companyExists = await checkCompany(company);
    if (companyExists) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Company name already used',
      });
    }
    // Check if the email is already used
    const emailExists = await checkEmail(email);
    if (emailExists) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Email Used',
      });
    }

    // Insert new company
    const companyId = await insertCompany(company);

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

    // Success Response
    return res.status(200).json({
      error: false,
      message: 'Account registered',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Register',
    });
  }
};

// Authorization
// eslint-disable-next-line consistent-return
exports.isLoggedIn = async (req, res, next) => {
  try {
    // Check Existing Token
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Token not found',
      });
    }

    // Token Validation & Decode
    const token = authorization.split(' ')[1];
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
          reject(err);
        } else {
          resolve(decode);
        }
      });
    });

    // User Id Validation
    const userExist = await checkUserId(decoded.id);
    if (userExist) {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Invalid user',
      });
    }
    req.user = decoded;
    // Continue to next logic
    next();
  } catch (err) {
    // Invalid Token & Error Handling
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Token expired',
      });
    } if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: true,
        message: 'Unauthorized: Token is invalid',
      });
    }
    console.error('Token Check Server Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Token Check',
    });
  }
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
