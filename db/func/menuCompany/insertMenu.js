// Helper Function for insert menuCompany to db

const db = require('../pool');

exports.insertMenu = async (menu) => {
  const {
    name, category, basePrice, baseOnlinePrice, companyid,
  } = menu;
  const query = 'INSERT INTO menus (name, category, basePrice, baseOnlinePrice, companyId) VALUES ($1, $2, $3, $4, $5)';
  const values = [name, category, basePrice, baseOnlinePrice, companyid];
  try {
    await db.query(query, values);
  } catch (err) {
    console.error('Insert Menu DB Error:', err);
    throw err;
  }
};
