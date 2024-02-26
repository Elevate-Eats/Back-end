const jwt = require('jsonwebtoken');
const Joi = require('joi');
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

exports.showAllBranch = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded; // Assuming companyId is directly available in the decoded object
    const { search, limit } = req.query;
    db.query('SELECT * FROM branches WHERE companyId = $1', [companyid], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch branch data' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'Branch not found' });
      }
      let branchData = results.rows.map((branch) => {
        const {
          id, name, address, manager,
        } = branch;
        return {
          id, name, address, manager,
        };
      });
      if (search) {
        branchData = branchData.filter((branch) => branch.name.toLowerCase().startsWith(
          search.toLowerCase(),
        ));
      }
      if (limit) {
        branchData = branchData.slice(0, Number(limit));
      }
      return res.status(200).json({
        error: false,
        message: 'Branch data retrieved successfully',
        branchData,
      });
    });
  } catch (err) {
    console.log('showBranch Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to retrieve branch data' });
  }
  return console.log('showSingleBranch controller executed');
};

exports.showSingleBranch = async (req, res) => {
  try {
    const { id } = req.body;
    db.query('SELECT * FROM branches WHERE id = $1', [id], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch branch data' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'Branch not found' });
      }

      const {
        name, address, manager,
      } = results.rows[0];
      const branchData = {
        id, name, address, manager,
      };

      return res.status(200).json({
        error: false,
        message: 'Branch data retrieved successfully',
        branchData,
      });
    });
  } catch (err) {
    console.log('showBranch Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to retrieve branch data' });
  }
  return console.log('showSingleBranch controller executed');
};

exports.createBranch = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded; // Corrected companyId extraction
    const schema = Joi.object({
      name: Joi.string().min(1).required(),
      phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
      address: Joi.string().required(),
      managerId: Joi.number().required(),
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
      name, phone, address, managerId,
    } = value;
    db.query('INSERT INTO branches (name, phone, address, managerId,companyId) VALUES ($1,$2,$3,$4,$5)', [name, phone, address, managerId, companyid], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'failed to add branch',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Branch added',
      });
    });
  } catch (err) {
    console.log('addBranch Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed addBranch' });
  }
  return console.log('createBranch controller executed');
};

exports.deleteBranch = async (req, res) => {
  try {
    const { branchId } = req.body;
    db.query('DELETE FROM branches WHERE id = $1 ', [branchId], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: true,
          message: 'failed to delete branch',
        });
      }
      return res.status(200).json({
        error: false,
        message: 'Branch deleted',
      });
    });
  } catch (err) {
    console.log('addBranch Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed addBranch' });
  }
  return console.log('deleteBranch controller executed');
};

exports.updateBranch = async (req, res) => {
  console.log('Test Case');
  const schema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().min(1).required(),
    phone: Joi.string().pattern(/^\+62\d{9,12}$/).required(),
    address: Joi.string().required(),
    managerId: Joi.number().required(),
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
    id, name, phone, address, managerId,
  } = value;
  db.query('UPDATE branches SET name = $2, phone = $3, address = $4, managerId = $5 WHERE id=$1', [id, name, phone, address, managerId], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: true,
        message: 'failed to update branch',
      });
    }
    return res.status(200).json({
      error: false,
      message: 'Branch updated',
    });
  });
  return console.log('deleteBranch controller executed');
};
