// Helper Functions for deleteBranch
const db = require('../pool');

exports.deleteBranch = async (id) => {
  try {
    await db.query('DELETE FROM branches WHERE id = $1', [id]);
  } catch (err) {
    console.error('Delete Branch DB Error:', err);
    throw err;
  }
};
exports.checkIfBranchDeletable = async (id) => {
  try {
    const { rows } = await db.query('SELECT COUNT(*) FROM employees WHERE branchid = $1', [id]);
    return rows[0].count > 0;
  } catch (err) {
    console.error('Check If Branch Deletable DB Error:', err);
    throw err;
  }
};
