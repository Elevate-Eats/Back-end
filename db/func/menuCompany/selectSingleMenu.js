// Function Helper for Show Menu

const db = require('../pool');

exports.selectSingleMenu = async (id) => {
  try {
    const query = 'SELECT id, name, category, basePrice, baseOnlinePrice FROM menus WHERE id = $1';
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0];
  } catch (err) {
    console.error('Select Single Menu DB Error:', err);
    throw err;
  }
};
