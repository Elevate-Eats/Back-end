// Function Helper for Inserting Transaction
const db = require('../pool');

exports.insertTransaction = async (transaction) => {
  const {
    transactiondate,
    discount,
    status,
    paymentmethod,
    totalprice,
    branchid,
    customername,
    tableNumber,
    companyid,
    cashierid,
  } = transaction;
  try {
    const query = ('INSERT INTO transactions (transactiondate, discount, status, paymentmethod, totalprice, branchid, customername, tablenumber, companyid, cashierid) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id');
    const values = [
      transactiondate,
      discount,
      status,
      paymentmethod,
      totalprice, branchid,
      customername,
      tableNumber,
      companyid,
      cashierid,
    ];
    const { rows } = await db.query(query, values);
    return rows[0].id;
  } catch (err) {
    console.error('Insert Transaction DB Error:', err);
    throw err;
  }
};
