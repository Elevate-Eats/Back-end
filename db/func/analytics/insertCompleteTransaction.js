// Function helper to insert a completed transaction

const db = require('../pool');

exports.insertCompleteTransaction = async (transactionId) => {
  try {
    const query = 'INSERT INTO completetransactions (transactionid) VALUES ($1)';
    const values = [transactionId];
    await db.query(query, values);
  } catch (err) {
    console.error('Insert Complete Transaction DB Error:', err);
    throw err;
  }
};
