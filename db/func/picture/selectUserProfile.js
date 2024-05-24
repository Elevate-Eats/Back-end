// Function to update a User's Profile Pic

const db = require('../pool');

exports.selectUserProfile = async (id) => {
  try {
    const query = 'SELECT profilepicname FROM users WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0].profilepicname;
  } catch (err) {
    console.error('Select User Profile Pic DB Error:', err);
    throw err;
  }
};
