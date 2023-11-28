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

exports.showAllBranch = async (req, res) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyId } = decoded; // Assuming companyId is directly available in the decoded object
    db.query('SELECT * FROM branches WHERE company_id = $1', [companyId], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch branch data' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'Branch not found' });
      }
      const branchData = results.rows.map((branch) => {
        const { name, address, manager } = branch;
        return { name, address, manager };
      });
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
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyId } = decoded; // Assuming companyId is directly available in the decoded object
    const { branchName } = req.body;

    db.query('SELECT * FROM branches WHERE company_id = $1 AND branchName = $2', [companyId, branchName], (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: true, message: 'Failed to fetch branch data' });
      }

      if (results.rows.length === 0) {
        return res.status(404).json({ error: true, message: 'Branch not found' });
      }

      const { name, address, manager } = results.rows[0];
      const branchData = { name, address, manager };

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
    const { companyId } = decoded; // Corrected companyId extraction
    const { name, address, manager } = req.body;
    db.query('INSERT INTO branches (name,address,manager,company_id) VALUES ($1,$2,$3)', [name, address, manager, companyId], (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({
          error: false,
          message: 'Branch added',
        });
      }
      return console.log('New Branch added to branches table');
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
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyId } = decoded;
    const { branchName } = req.body;
    db.query('DELETE FROM branches WHERE company_id = $1 AND name = $2 ', [companyId, branchName], (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({
          error: false,
          message: 'Branch deleted',
        });
      }
      return console.log('deleteBranch controller executed');
    });
  } catch (err) {
    console.log('addBranch Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed addBranch' });
  }
  return console.log('deleteBranch controller executed');
};

exports.updateBranch = async (req, res) => {
  const authorizationHeader = req.headers.authorization;
  const token = authorizationHeader.split(' ')[1];
  const decoded = jwt.decode(token, process.env.JWT_SECRET);
  const { companyId } = decoded;
  const {
    branchName,
    newName,
    address,
    manager,
  } = req.body;
  db.query('UPDATE branches SET name = $3, address = $4, manager = $5 WHERE company_id = $1 AND name = $2', [companyId, branchName, newName, address, manager], (err) => {
    if (err) {
      console.log(err);
    } else {
      return res.status(200).json({
        error: false,
        message: 'Branch updated',
      });
    }
    return console.log('deleteBranch controller executed');
  });
};
