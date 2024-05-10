// Helper Function delete a menu from MenuBranch

const db = require('../pool');

exports.deleteMenu = async (branchId, menuId) => {
  try {
    const query = 'DELETE FROM menubranch WHERE branchId = $1 AND menuId = $2';
    const values = [branchId, menuId];
    await db.query(query, values);
  } catch (err) {
    console.error('Delete MenuBranch DB Error:', err);
    throw err;
  }
};
