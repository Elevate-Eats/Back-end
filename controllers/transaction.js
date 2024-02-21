const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// const nodemailer = require('nodemailer');
// const shortid = require('shortid');
const db = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
exports.addTransaction = async (req, res) => {
  try {
    // const authorizationHeader = req.headers.authorization;
    // const token = authorizationHeader.split(' ')[1];
    // const decoded = jwt.decode(token, process.env.JWT_SECRET);
    // const { companyid } = decoded;
    const { transaction, items } = req.body;
    db.query('Insert INTO transactions(transactionDate, discount, status, paymentMethod, totalPrice,branchId) VALUES ($1, $2, $3, $4, $5, $6)', [transaction.transactionDate, transaction.discount, transaction.status, transaction.paymentMethod, transaction.totalPrice, transaction.branchId], (err) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({
          error: false,
          message: 'Transaction added',
        });
      }
      return console.log('New Branch added to branches table');
    });
    // const itemsPromises = items.map(item => {
    //     return new Promise((resolve, reject) => {
    //         // Add the transaction ID to each item before insertion
    //         const itemWithTransactionId = { ...item, transaction_id: transactionId };

    //         db.query('INSERT INTO items SET ?', itemWithTransactionId, (err, itemResult) => {
    //             if (err) {
    //                 console.log(err);
    //                 reject('Error adding item');
    //             } else {
    //                 resolve('Item added successfully');
    //             }
    //         });
    //     });

  } catch (err) {
    console.log('showBranch Error:');
    console.log(err);
    return res.status(500).json({ error: true, message: 'Failed to retrieve branch data' });
  }
  return console.log('showSingleBranch controller executed');
};
