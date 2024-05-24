const db = require('../pool');

exports.selectSingleMenu = async (menuId, branchId) => {
  try {
    // Updated query to include a join with menucompany
    const query = `
      SELECT mb.menuid, mb.branchid, mb.name, mb.category, mb.baseprice, mb.baseonlineprice, mc.profilepicname
      FROM menubranch mb
      LEFT JOIN menus mc ON mb.menuid = mc.id
      WHERE mb.menuid = $1 AND mb.branchid = $2
    `;
    const values = [menuId, branchId];
    const result = await db.query(query, values);
    return result.rows[0];
  } catch (err) {
    console.error('Select Single MenuBranch DB Error:', err);
    throw err;
  }
};
