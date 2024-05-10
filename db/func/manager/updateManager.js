// Function to update a manager

const db = require('../pool');

exports.updateManager = async (manager) => {
  const {
    id, name, nickname, phone, role, email, branchAccess,
  } = manager;
  try {
    const query = 'UPDATE users SET name = $2, nickname = $3, phone = $4, role = $5, email = $6, branchAccess = $7 WHERE id = $1';
    const values = [id, name, nickname, phone, role, email, branchAccess];
    await db.query(query, values);
  } catch (err) {
    console.error('Update Manager DB Error:', err);
    throw err;
  }
};
