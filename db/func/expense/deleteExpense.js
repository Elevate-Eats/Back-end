// Delete Expense function helper
const db = require('../pool');

exports.deleteExpense = async (id) => {
  const query = `
    DELETE FROM expenses
    WHERE id = $1;
  `;
  try {
    await db.query(query, [id]);
  } catch (err) {
    console.error('Delete Expense DB Error:', err);
    throw err;
  }
};
