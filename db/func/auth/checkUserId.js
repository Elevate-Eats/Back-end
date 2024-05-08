const db = require('../pool');

exports.checkUserId = async (id) => {
  try {
    const { rows } = await db.query('SELECT id FROM users WHERE id = $1', [id]);
    return rows.length === 0;
  } catch (err) {
    console.error('Error checking User Id: ', err);
    throw err;
  }
};
