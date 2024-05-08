// Helper Function for showBranch
const db = require('../pool');

exports.selectSingleBranch = async (id) => {
  try {
    const { rows } = await db.query('SELECT id, name, phone, address, managerId FROM branches WHERE id = $1', [id]);
    return rows[0];
  } catch (err) {
    console.error('Select Single Branch DB Error:', err);
    throw err;
  }
};
