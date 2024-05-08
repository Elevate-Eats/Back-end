// Helper Functions for updateBranch
const db = require('../pool');

exports.updateBranch = async (branch) => {
  const {
    id, name, phone, address, managerId,
  } = branch;
  const query = 'UPDATE branches SET name = $2, phone = $3, address = $4, managerId = $5 WHERE id = $1';
  const values = [id, name, phone, address, managerId];
  try {
    await db.query(query, values);
  } catch (err) {
    console.error('Update Branch DB Error:', err);
    throw err;
  }
};
