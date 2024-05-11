// Insert Expense to DB helper func

const db = require('../pool');

exports.insertExpense = async (expenseData) => {
  const {
    name, count, price, total, date, notes, category, branchId,
  } = expenseData;
  const query = `
    INSERT INTO expenses (name, count, price, total, date, notes, category, branchId)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  const values = [name, count, price, total, date, notes, category, branchId];
  try {
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Insert Expense DB Error:', err);
    throw err;
  }
};
