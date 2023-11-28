const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const branchController = require('../controllers/branch.js');

const router = express.Router();

router.post('/showBranches', isLoggedIn, branchController.showAllBranch);
router.post('/showSingleBranch', isLoggedIn, branchController.showSingleBranch);
router.post('/addBranch', isLoggedIn, branchController.createBranch);
router.post('/deleteBranch', isLoggedIn, branchController.deleteBranch);
router.post('/updateBranch', isLoggedIn, branchController.updateBranch);

module.exports = router;
