// Helper Function insert a MenuBranch

const db = require('../pool');

exports.insertMenu = async (menuBranch) => {
  const {
    name, category, basePrice, baseOnlinePrice, menuId, branchId,
  } = menuBranch;
  try {
    const query = 'INSERT INTO menubranch (name, category, basePrice, baseOnlinePrice, menuid, branchid) VALUES ($1, $2, $3, $4, $5, $6)';
    const values = [name, category, basePrice, baseOnlinePrice, menuId, branchId];
    await db.query(query, values);
  } catch (err) {
    console.error('Insert MenuBranch DB Error:', err);
    throw err;
  }
};
