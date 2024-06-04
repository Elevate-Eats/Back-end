// Function Helper for Inserting Transaction
const db = require('../pool');

exports.selectTransactions = async (companyid, filters, offset) => {
  try {
    const {
      search, limit, branch, status,
    } = filters;
    console.log(status);
    let query = 'SELECT * FROM transactions WHERE companyid = $1';
    const values = [companyid];

    // Adding conditions based on branch and status
    if (branch) {
      query += ' AND branchid = $2';
      values.push(branch);
      if (status) {
        query += ' AND status = $3';
        values.push(status);
      }
    } else if (status) {
      query += ' AND status = $2';
      values.push(status);
    }

    // Integrating search into the SQL query
    if (search) {
      query += ` AND LOWER(customername) LIKE LOWER($${values.length + 1})`;
      values.push(`${search}%`);
    }

    // Applying limit directly in the SQL query
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    const { rows } = await db.query(query, values);
    return rows;
  } catch (err) {
    console.error('Select Transactions DB Error:', err);
    throw err;
  }
};
