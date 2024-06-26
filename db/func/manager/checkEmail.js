// Check Email Helper Function

const db = require('../pool');

exports.checkEmail = async (email) => {
  try {
    const { rows } = await db.query('SELECT email FROM users WHERE email = $1', [email]);
    return rows.length > 0;
  } catch (err) {
    console.error('Error checking email: ', err);
    throw err;
  }
};
