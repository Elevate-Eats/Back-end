// Check Company Helper Function

const db = require('../pool');

exports.getCompany = async (companyid) => {
  try {
    const { rows } = await db.query('SELECT * FROM companies WHERE id = $1', [companyid]);
    const companyName = rows[0].name;
    const companyProfilePic = rows[0].profilepicname;
    return {
      companyName,
      companyProfilePic
    }
  } catch (err) {
    console.error('Error checking email: ', err);
    throw err;
  }
};
