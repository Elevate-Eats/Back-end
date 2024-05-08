// Check Company Helper Function

const db = require('../pool');

exports.checkCompany = async (companyName) => {
  try {
    const { rows } = await db.query('SELECT name FROM companies WHERE name = $1', [companyName]);
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking email: ', err);
    throw err;
  }
};
