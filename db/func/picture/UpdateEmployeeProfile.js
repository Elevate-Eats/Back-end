// Function to update a Employee's Profile Pic

const db = require('../pool');

exports.updateEmployeeProfile = async (id, profilePictureName) => {
  try {
    const query = 'UPDATE employees SET profilepicname = $2 WHERE id = $1';
    const values = [id, profilePictureName];
    await db.query(query, values);
  } catch (err) {
    console.error('Update Employee Profile Pic DB Error:', err);
    throw err;
  }
};
