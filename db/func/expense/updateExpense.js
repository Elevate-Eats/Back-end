// Update expense to DB Function Helper
const db = require('../pool');

exports.updateExpense = async (expenseData) => {
  const {
    id, name, count, date, notes, category, branchId,
  } = expenseData;
  const query = `
    UPDATE expenses
    SET name = $2, count = $3, date = $4, notes = $5, category = $6, branchId = $7
    WHERE id = $1
  `;
  const values = [id, name, count, date, notes, category, branchId];
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Update Expense DB Error:', err);
    throw err;
  }
};
