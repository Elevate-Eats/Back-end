// Function helper to SelectItems from DB

const db = require('../pool');

exports.selectItems = async (transactionId) => {
  try {
    const query = 'SELECT * FROM items WHERE transactionid = $1';
    const values = [transactionId];
    const { rows } = await db.query(query, values);
    return rows.map((item) => ({
      id: item.id,
      count: item.count,
      price: item.price,
      totalprice: item.totalprice,
      menuid: item.menuid,
      transactionId,
      category: item.category,
      pricingcategory: item.pricingcategory,
    }));
  } catch (err) {
    console.error('Select All Items DB Error:', err);
    throw err;
  }
};
