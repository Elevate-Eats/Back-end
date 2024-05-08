// Helper Function for showBranch
const db = require('../pool');

exports.insertBranch = async (branch) => {
  const {
    name, phone, address, managerId, companyid,
  } = branch;
  const query = 'INSERT INTO branches (name, phone, address, managerId, companyid) VALUES ($1, $2, $3, $4, $5)';
  const values = [name, phone, address, managerId, companyid];
  try {
    await db.query(query, values);
  } catch (err) {
    console.error('Insert Branch DB Error:', err);
    throw err;
  }
};
