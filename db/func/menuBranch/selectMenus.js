// Helper Function Select MenuBranch

const db = require('../pool');

exports.selectMenus = async (branchId, search, limit) => {
  try {
    let query = 'SELECT menuid, branchid, name, category, baseprice, baseonlineprice FROM menubranch WHERE branchid = $1';
    const values = [branchId];
    if (search && Number.isNaN(limit)) {
      query += ' AND LOWER(name) LIKE LOWER($2)';
      values.push(`%${search}%`);
    }
    if (!Number.isNaN(limit) && !search) {
      query += ' LIMIT $2';
      values.push(limit);
    }
    if (!Number.isNaN(limit) && search) {
      query += ' AND LOWER(name) LIKE LOWER($2) LIMIT $3';
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
