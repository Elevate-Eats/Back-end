// Insert User Helper Function

const db = require('../pool');

exports.insertUser = async (user) => {
  const {
    name,
    nickname,
    email,
    password,
    branchAccess,
    companyId,
    role,
    phone,
  } = user;

  try {
    const text = `
      INSERT INTO users 
      (name, nickname, email, password, role, phone, branchAccess, companyId)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      name,
      nickname,
      email,
      password,
      role,
      phone,
      branchAccess,
      companyId,
    ];
    const results = await db.query(text, values);
    return results.rows[0];
  } catch (err) {
    console.error('Error inserting user:', err);
    throw err;
  }
};
