// Function to update a Company's Profile Pic

const db = require('../pool');

exports.updateCompanyProfile = async (id, profilePictureName) => {
  try {
    const query = 'UPDATE companies SET profilepicname = $2 WHERE id = $1';
    const values = [id, profilePictureName];
    await db.query(query, values);
  } catch (err) {
    console.error('Update Company Profile Pic DB Error:', err);
    throw err;
  }
};
