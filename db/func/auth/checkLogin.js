// Check Login Helper Function

const bcrypt = require('bcryptjs');
const db = require('../pool');

exports.checkLogin = async (email, password) => {
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return {
        valid: false,
        message: 'Bad Request: Email Invalid',
      };
    }
    if (!await bcrypt.compare(password, rows[0].password)) {
      return {
        valid: false,
        message: 'Bad Request: Password Invalid',
      };
    }
    const {
      id,
      nickname,
      role,
      companyid,
      branchAccess,
    } = rows[0];
    const credentials = {
      id,
      nickname,
      role,
      companyid,
      branchAccess,
    };
    return {
      valid: true,
      message: 'Login: Succeed',
      credentials,
    };
  } catch (err) {
    console.error('Error checking login: ', err);
    throw err;
  }
};
