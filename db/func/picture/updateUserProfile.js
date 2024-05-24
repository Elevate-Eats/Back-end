// Function to update a User's Profile Pic

const db = require('../pool');

exports.updateUserProfile = async (id, profilePictureName) => {
  try {
    const query = 'UPDATE users SET profilepicname = $2 WHERE id = $1';
    const values = [id, profilePictureName];
    await db.query(query, values);
  } catch (err) {
    console.error('Update User Profile Pic DB Error:', err);
    throw err;
  }
};
