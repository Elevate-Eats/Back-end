// Function to select a single manager

const db = require('../pool');

exports.selectSingleManager = async (id) => {
  try {
    const { rows } = await db.query('SELECT id, name, nickname, phone, email, role, branchAccess FROM users WHERE id = $1', [id]);
    return rows[0];
  } catch (err) {
    console.error('Select Single Manager DB Error:', err);
    throw err;
  }
};
