const { Pool } = require('pg');

const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
exports.updateItemDetails = async (itemId, transactionId, count, menuId, pricingCategory) => {
  // Fetch branchId from the transactions table
  const transactionQueryResult = await db.query('SELECT branchid FROM transactions WHERE id = $1', [transactionId]);
  const fetchedBranchId = transactionQueryResult.rows[0].branchid;

  // Determine price based on pricingcategory
  let fetchedPrice;
  if (pricingCategory === 'base') {
    const priceQueryResult = await db.query('SELECT baseprice FROM menubranch WHERE menuid = $1 AND branchid = $2', [menuId, fetchedBranchId]);
    fetchedPrice = priceQueryResult.rows[0].baseprice;
  } else if (pricingCategory === 'online') {
    const priceQueryResult = await db.query('SELECT baseonlineprice FROM menubranch WHERE menuid = $1 AND branchid = $2', [menuId, fetchedBranchId]);
    fetchedPrice = priceQueryResult.rows[0].baseonlineprice;
  }

  // Calculate totalprice as count times fetchedPrice
  const calculatedTotalPrice = count * fetchedPrice;

  // Update the items table with price and totalprice
  await db.query('UPDATE items SET price = $1, totalprice = $2 WHERE id = $3', [fetchedPrice, calculatedTotalPrice, itemId]);
};
