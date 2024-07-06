// Function Helper for Updating Transaction
const db = require('../pool');

exports.updateTransaction = async (transaction) => {
  const {
    id,
    transactiondate,
    discount, status,
    paymentmethod,
    totalprice, branchid,
    customername,
    tableNumber,
    cashierid,
  } = transaction;
  try {
    const query = 'UPDATE transactions SET transactiondate = $1, discount = $2, status = $3, paymentmethod = $4, totalprice = $5, branchid = $6, customername = $7, tablenumber = $8, cashierid= $10 WHERE id = $9';
    const values = [
      transactiondate,
      discount,
      status,
      paymentmethod,
      totalprice,
      branchid,
      customername,
      tableNumber,
      id,
      cashierid,
    ];
    await db.query(query, values);
  } catch (err) {
    console.error('Update Transaction DB Error:', err);
    throw err;
  }
};
