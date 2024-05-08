// Helper Function For Insert Employee

const db = require('../pool');

exports.insertEmployee = async (employee) => {
  const {
    name, salary, bonus, companyid,
  } = employee;
  const query = 'INSERT INTO employees (name, salary, bonus, companyid) VALUES ($1, $2, $3, $4)';
  const values = [name, salary, bonus, companyid];
  try {
    await db.query(query, values);
  } catch (err) {
    console.error('Insert Employee DB Error:', err);
    throw err;
  }
};
