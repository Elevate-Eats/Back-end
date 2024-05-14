// Select expense to DB Function Helper

const db = require('../pool');

exports.selectExpenses = async (search, limit, branchId, date) => {
  try {
    let query = 'SELECT * FROM expenses WHERE branchid = $1 AND date = $2';
    const values = [branchId, date];
    if (search && Number.isNaN(limit)) {
      query += ' AND LOWER(name) LIKE LOWER($3)';
      values.push(`%${search}%`);
    }
    if (!Number.isNaN(limit) && !search) {
      query += ' LIMIT $3';
      values.push(limit);
    }
    if (!Number.isNaN(limit) && search) {
      query += ' AND LOWER(name) LIKE LOWER($3) LIMIT $4';
      values.push(`%${search}%`);
      values.push(limit);
    }
    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error('Fetch All Expenses DB Error:', err);
    throw err;
  }
};
