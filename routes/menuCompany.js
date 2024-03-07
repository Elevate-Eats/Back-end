const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const menuCompanyController = require('../controllers/menuCompany.js');

const router = express.Router();
router.post('/addMenu', isLoggedIn, menuCompanyController.addMenu);
router.post('/updateMenu', isLoggedIn, menuCompanyController.updateMenu);
router.get('/showMenus', isLoggedIn, menuCompanyController.showMenus);
router.post('/showSingleMenu', isLoggedIn, menuCompanyController.showSingleMenu);
router.post('/deleteMenu', isLoggedIn, menuCompanyController.deleteMenus);
module.exports = router;
