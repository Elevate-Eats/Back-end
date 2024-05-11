// Select Single Expense function helper
const db = require('../pool');

exports.selectSingleExpense = async (id) => {
  const query = `
    SELECT * FROM expenses
    WHERE id = $1;
  `;
  try {
    const result = await db.query(query, [id]);
    return result.rows[0];
  } catch (err) {
    console.error('Fetch Single Expense DB Error:', err);
    throw err;
  }
};
