// Function to insert a new manager

const db = require('../pool');

exports.insertManager = async (manager) => {
  const {
    name, nickname, email, password, role, phone, branchAccess, companyid,
  } = manager;
  try {
    const query = 'INSERT INTO users (name, nickname, email, password, role, phone, branchAccess, companyId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    const values = [name, nickname, email, password, role, phone, branchAccess, companyid];
    await db.query(query, values);
  } catch (err) {
    console.error('Insert Manager DB Error:', err);
    throw err;
  }
};
