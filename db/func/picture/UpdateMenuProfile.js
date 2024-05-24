// Function to update a Menu's Profile Pic

const db = require('../pool');

exports.updateMenuProfile = async (id, profilePictureName) => {
  try {
    const query = 'UPDATE menus SET profilepicname = $2 WHERE id = $1';
    const values = [id, profilePictureName];
    await db.query(query, values);
  } catch (err) {
    console.error('Update Menu Profile Pic DB Error:', err);
    throw err;
  }
};
