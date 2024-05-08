// Insert Company Helper Function

const db = require('../pool');

exports.insertCompany = async (companyName) => {
  try {
    const { rows } = await db.query('INSERT INTO companies (name) VALUES ($1) RETURNING *', [companyName]);
    return rows[0].id;
  } catch (err) {
    console.error('Error inserting company:', err);
    throw err;
  }
};
