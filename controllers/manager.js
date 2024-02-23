const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

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
    const { companyid } = decoded; // Assuming companyId is directly available in the decoded object
    db.query('SELECT * FROM users WHERE companyId = $1', [companyid], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch manager data' });
      }
      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'manager not found' });
      }
      const managerData = results.rows.map((manager) => {
        const {
          id, name, phone, email, role, branchAccess,
        } = manager;
        return {
          id, name, phone, email, role, branchAccess,
        };
      });
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
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded; // Assuming companyId is directly available in the decoded object
    const { managerId } = req.body;
    db.query('SELECT * FROM users WHERE companyId = $1 AND id = $2', [companyid, managerId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch manager data' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'Manager not found' });
      }

      const {
        id, name, phone, email, role, branchAccess,
      } = results.rows[0];
      const managerData = {
        id, name, phone, email, role, branchAccess,
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
    const { managerId } = req.body;
    db.query('DELETE FROM users WHERE id = $1 ', [managerId], (err) => {
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
    return res.status(500).json({ error: true, message: 'Failed deleteManager' });
  }
  return console.log('deleteManager controller executed');
};

exports.updateManager = async (req, res) => {
  try {
    const { managerId } = req.body;
    const {
      name,
      nickname,
      phone,
      email,
      role,
      branchAccess,
    } = req.body;
    db.query('UPDATE users SET name = $2, address = $3, manager = $4 WHERE id = $1', [managerId, name, nickname, phone, email, role, branchAccess], (err) => {
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
