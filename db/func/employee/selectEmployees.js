// Helper Function For Select  Employees

const db = require('../pool');

exports.selectEmployees = async (companyid, search, limit, unassigned) => {
  try {
    let query = 'SELECT * FROM employees WHERE companyid = $1';
    const values = [companyid];
    if (unassigned) {
      query += ' AND branchid IS NULL';
    }
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
    console.error('Select All Employees DB Error:', err);
    throw err;
  }
};
