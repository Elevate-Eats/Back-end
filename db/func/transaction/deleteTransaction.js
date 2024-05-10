// Function Helper to delete items

const db = require('../pool');

exports.deleteTransaction = async (id) => {
  try {
    await db.query('DELETE FROM transactions WHERE id = $1', [id]);
  } catch (err) {
    console.error('Delete Transaction DB Error:', err);
    throw err;
  }
};
