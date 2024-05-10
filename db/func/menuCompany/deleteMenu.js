// Function helper for Delete Menu

const db = require('../pool');

exports.deleteMenu = async (id) => {
  try {
    const query = 'DELETE FROM menus WHERE id = $1';
    const values = [id];
    await db.query(query, values);
  } catch (err) {
    console.error('Delete Menu DB Error:', err);
    throw err;
  }
};