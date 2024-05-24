const db = require('../pool');

exports.selectMenus = async (branchId, search, limit) => {
  try {
    // Joining the menucompany table to fetch profilepicname
    let query = `
      SELECT mb.menuid, mb.branchid, mb.name, mb.category, mb.baseprice, mb.baseonlineprice, mc.profilepicname 
      FROM menubranch mb 
      LEFT JOIN menus mc ON mb.menuid = mc.id 
      WHERE mb.branchid = $1
    `;
    const values = [branchId];
    if (search && Number.isNaN(limit)) {
      query += ' AND LOWER(mb.name) LIKE LOWER($2)';
      values.push(`%${search}%`);
    }
    if (!Number.isNaN(limit) && !search) {
      query += ' LIMIT $2';
      values.push(limit);
    }
    if (!Number.isNaN(limit) && search) {
      query += ' AND LOWER(mb.name) LIKE LOWER($2) LIMIT $3';
      values.push(`%${search}%`);
      values.push(limit);
    }
    const result = await db.query(query, values);
    return result.rows;
  } catch (err) {
    console.error('Select MenuBranches DB Error:', err);
    throw err;
  }
};
