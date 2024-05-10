// Function helper to InsertItems from DB

const db = require('../pool');

exports.insertItems = async (items) => {
  try {
    const queries = items.map((item) => {
      const query = 'INSERT INTO items (count, menuid, pricingcategory, transactionid, price, totalprice, category) VALUES ($1,$2,$3,$4,$5,$6,$7)';
      const values = [
        item.count,
        item.menuId,
        item.pricingCategory,
        item.transactionId,
        item.price,
        item.totalPrice,
        item.category,
      ];
      return db.query(query, values);
    });
    await Promise.all(queries);
  } catch (err) {
    console.error('Insert Item DB Error:', err);
    throw err;
  }
};
