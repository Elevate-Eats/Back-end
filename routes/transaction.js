const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const transactionController = require('../controllers/transaction.js');

const router = express.Router();

router.get('/showTransaction', isLoggedIn, transactionController.showTransactions);
router.post('/addTransaction', isLoggedIn, transactionController.addTransaction);
router.post('/deleteTransaction', isLoggedIn, transactionController.deleteTransaction);
router.post('/updateTransaction', isLoggedIn, transactionController.updateTransaction);

module.exports = router;
