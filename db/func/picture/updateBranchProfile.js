// Function to update a Branch's Profile Pic

const db = require('../pool');

exports.updateBranchProfile = async (id, profilePictureName) => {
  try {
    const query = 'UPDATE branches SET profilepicname = $2 WHERE id = $1';
    const values = [id, profilePictureName];
    await db.query(query, values);
  } catch (err) {
    console.error('Update Branch Profile Pic DB Error:', err);
    throw err;
  }
};
