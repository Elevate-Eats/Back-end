// Function helper to DeleteItems from DB

const db = require('../pool');

exports.deleteItems = async (itemIds) => {
  try {
    const queries = itemIds.map((id) => {
      const query = 'DELETE FROM items WHERE id = $1';
      const values = [id];
      return db.query(query, values);
    });
    await Promise.all(queries);
  } catch (err) {
    console.error('Delete Items DB Error:', err);
    throw err;
  }
};
