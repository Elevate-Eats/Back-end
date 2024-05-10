// Helper Function Select Single MenuBranch

const db = require('../pool');

exports.selectSingleMenu = async (menuId, branchId) => {
  try {
    const query = 'SELECT menuid, branchid, name, category, baseprice, baseonlineprice FROM menubranch WHERE menuid = $1 AND branchid = $2';
    const values = [menuId, branchId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Select Single MenuBranch DB Error:', err);
    throw err;
  }
};
