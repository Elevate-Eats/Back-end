// Helper Function update MenuBranch

const db = require('../pool');

exports.updateMenu = async (menuBranch) => {
  const {
    menuId, branchId, name, category, basePrice, baseOnlinePrice,
  } = menuBranch;
  try {
    const query = 'UPDATE menubranch SET name = $3, category = $4, basePrice = $5, baseOnlinePrice = $6 WHERE menuId = $1 AND branchId = $2';
    const values = [menuId, branchId, name, category, basePrice, baseOnlinePrice];
    await db.query(query, values);
  } catch (err) {
    console.error('Update MenuBranch DB Error:', err);
    throw err;
  }
};
