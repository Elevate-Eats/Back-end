// Helper Function For Update Employee

const db = require('../pool');

exports.updateEmployee = async (employee) => {
  const {
    id, name, salary, bonus, branchId,
  } = employee;
  const query = 'UPDATE employees SET name = $2, salary = $3, bonus = $4, branchId = $5 WHERE id = $1';
  const values = [id, name, salary, bonus, branchId];
  try {
    await db.query(query, values);
  } catch (err) {
    console.error('Update Employee DB Error:', err);
    throw err;
  }
};
exports.updateEmployeeBranch = async (employeeIds, branchId) => {
  try {
    const queries = employeeIds.map((employeeId) => db.query('UPDATE employees SET branchid = $2 WHERE id = $1', [employeeId, branchId]));
    await Promise.all(queries);
  } catch (err) {
    console.error('Update Employees Branch ID DB Error:', err);
    throw err;
  }
};
