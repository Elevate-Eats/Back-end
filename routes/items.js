const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const itemsController = require('../controllers/items.js');

const router = express.Router();

router.get('/showItems', isLoggedIn, itemsController.showItems);
router.post('/addItems', isLoggedIn, itemsController.addItems);
router.post('/deleteItems', isLoggedIn, itemsController.deleteItems);
router.post('/updateItems', isLoggedIn, itemsController.updateItems);
module.exports = router;
