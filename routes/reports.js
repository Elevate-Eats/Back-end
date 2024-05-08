const express = require('express');
const { isLoggedIn } = require('../controllers/auth');
const reportController = require('../controllers/report');

const router = express.Router();

/**
 * @swagger
 * paths:
 *   /report/v1/showDailyReport:
 *     get:
 *       summary: Fetches the daily report as a PDF
 *       tags:
 *         - Report
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: query
 *           name: branchId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The ID of the branch to fetch the report for
 *         - in: query
 *           name: date
 *           schema:
 *             type: string
 *             format: date-time
 *           required: true
 *           description: The date of the report in YYYY-MM-DD
 *       responses:
 *         200:
 *           description: Daily report fetched successfully
 *           content:
 *             application/pdf:
 *               schema:
 *                 type: string
 *                 format: binary
 *               example: PDF data stream
 *         400:
 *           description: Bad request, parameter missing or incorrect
 *         500:
 *           description: Internal server error, unable to fetch report
 */
router.get('/showDailyReport', isLoggedIn, reportController.getDailyReport);

module.exports = router;
