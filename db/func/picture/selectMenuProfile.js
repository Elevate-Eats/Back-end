// Function to update a Menu's Profile Pic

const db = require('../pool');

exports.selectMenuProfile = async (id) => {
  try {
    const query = 'SELECT profilepicname FROM menus WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0].profilepicname;
  } catch (err) {
    console.error('Select Menu Profile Pic DB Error:', err);
    throw err;
  }
};
