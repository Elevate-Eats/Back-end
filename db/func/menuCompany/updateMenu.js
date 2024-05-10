// Function Helper for updateMenu

const db = require('../pool');

exports.updateMenu = async (menu) => {
  const {
    id, name, category, basePrice, baseOnlinePrice,
  } = menu;
  const query = 'UPDATE menus SET name = $2, category = $3, basePrice = $4, baseOnlinePrice = $5 WHERE id = $1';
  const values = [id, name, category, basePrice, baseOnlinePrice];
  try {
    await db.query(query, values);
  } catch (err) {
    console.error('Update Menu DB Error:', err);
    throw err;
  }
};
