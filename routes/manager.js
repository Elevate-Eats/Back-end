const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const managerController = require('../controllers/manager.js');

const router = express.Router();

router.get('/showManagers', isLoggedIn, managerController.showAllManager);
router.post('/showSingleManager', isLoggedIn, managerController.showSingleManager);
router.post('/addManager', isLoggedIn, managerController.createManager);
router.post('/deleteManager', isLoggedIn, managerController.deleteManager);
router.post('/updateManager', isLoggedIn, managerController.updateManager);

module.exports = router;
