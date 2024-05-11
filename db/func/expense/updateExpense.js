// Update expense to DB Function Helper
const db = require('../pool');

exports.updateExpense = async (expenseData) => {
  const {
    id, name, count, price, total, date, notes, category, branchId,
  } = expenseData;
  const query = `
    UPDATE expenses
    SET name = $2, count = $3, price =$4, total = $5, date = $6, notes = $7, category = $8, branchId = $9
    WHERE id = $1
  `;
  const values = [id, name, count, price, total, date, notes, category, branchId];
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Update Expense DB Error:', err);
    throw err;
  }
};
