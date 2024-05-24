// Function to update a Employee's Profile Pic

const db = require('../pool');

exports.selectEmployeeProfile = async (id) => {
  try {
    const query = 'SELECT profilepicname FROM employees WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0].profilepicname;
  } catch (err) {
    console.error('Select Employee Profile Pic DB Error:', err);
    throw err;
  }
};
