// Function helper to UpdateItems from DB

const db = require('../pool');

exports.updateItems = async (items) => {
  try {
    const queries = items.map((item) => {
      const query = 'UPDATE items SET count = $2, pricingcategory = $3, price = $4, totalprice = $5 WHERE id = $1';
      const values = [item.id, item.count, item.pricingCategory, item.price, item.totalPrice];
      return db.query(query, values);
    });
    await Promise.all(queries);
  } catch (err) {
    console.error('Update Items DB Error:', err);
    throw err;
  }
};
