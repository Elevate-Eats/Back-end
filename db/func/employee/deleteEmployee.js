// Helper Function For Delete Employee

const db = require('../pool');

exports.deleteEmployee = async (id) => {
  try {
    await db.query('DELETE FROM employees WHERE id = $1', [id]);
  } catch (err) {
    console.error('Delete Employee DB Error:', err);
    throw err;
  }
};
