// Function Helper for Inserting Transaction
const db = require('../pool');

exports.selectTransactions = async (companyid, filters, offset) => {
  try {
    const {
      search, limit, branch, status, startDate, endDate,
    } = filters;
    let query = `SELECT transactions.*, users.name AS cashiername
    FROM transactions
    JOIN users ON transactions.cashierid = users.id
    WHERE transactions.companyid = $1`;
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

    // Date range filter
    if (startDate && endDate) {
      query += ` AND transactiondate BETWEEN $${values.length + 1} AND $${values.length + 2}`;
      values.push(startDate, endDate);
    } else if (startDate) {
      query += ` AND transactiondate >= $${values.length + 1}`;
      values.push(startDate);
    } else if (endDate) {
      query += ` AND transactiondate <= $${values.length + 1}`;
      values.push(endDate);
    }

    // Integrating search into the SQL query
    if (search) {
      query += ` AND LOWER(customername) LIKE LOWER($${values.length + 1})`;
      values.push(`${search}%`);
    }
    query += ' ORDER BY transactiondate DESC';
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
