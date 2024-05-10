// Function Helper to select Transaction

const db = require('../pool');

exports.selectSingleTransaction = async (id) => {
  try {
    const { rows } = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
    return rows[0] || null;
  } catch (err) {
    console.error('Select Single Transaction DB Error:', err);
    throw err;
  }
};
