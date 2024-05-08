// Helper Function for Select Branch
const db = require('../pool');

exports.selectBranches = async (companyid, search, limit) => {
  try {
    let query = 'SELECT id, name, address FROM branches WHERE companyid = $1';
    const values = [companyid];
    if (search && Number.isNaN(limit)) {
      query += ' AND LOWER(name) LIKE LOWER($2)';
      values.push(`%${search}%`);
    }
    if (!Number.isNaN(limit) && !search) {
      query += ' LIMIT $2';
      values.push(limit);
    }
    if (!Number.isNaN(limit) && search) {
      query += ' AND LOWER(name) LIKE LOWER($2) LIMIT $3';
      values.push(`%${search}%`);
      values.push(limit);
    }
    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error('Select Branches DB Error:', err);
    throw err;
  }
};
