const express = require('express');
const isLoggedIn = require('../controllers/auth.js');
const branchController = require('../controllers/branch.js');

const router = express.Router();

router.get('/showBranches', isLoggedIn, branchController.showAllBranch);
router.get('/showSingleBranch', isLoggedIn, branchController.showSingleBranch);
router.get('/addBranch', isLoggedIn, branchController.addBranch);
router.get('/deleteBranch', isLoggedIn, branchController.deleteBranch);
router.get('/updateBranch', isLoggedIn, branchController.updateBranch);
