// Helper Function For Select Single Employee

const db = require('../pool');

exports.selectSingleEmployee = async (id) => {
  try {
    const { rows } = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
    return rows[0] || null;
  } catch (err) {
    console.error('Select Single Employee DB Error:', err);
    throw err;
  }
};
