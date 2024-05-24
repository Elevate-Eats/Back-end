// Function to update a Company's Profile Pic

const db = require('../pool');

exports.selectCompanyProfile = async (id) => {
  try {
    const query = 'SELECT profilepicname FROM companies WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0].profilepicname;
  } catch (err) {
    console.error('Select Company Profile Pic DB Error:', err);
    throw err;
  }
};
