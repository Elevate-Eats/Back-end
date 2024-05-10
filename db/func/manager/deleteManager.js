// Function to delete a manager

const db = require('../pool');

exports.deleteManager = async (id) => {
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  } catch (err) {
    console.error('Delete Manager DB Error:', err);
    throw err;
  }
};
