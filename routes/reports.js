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
 *         401:
 *            description: Unauthorized due to Token Problem
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: true
 *                    message:
 *                      type: string
 *                      example: "Unauthorized: Token expired"
 *         500:
 *           description: Internal server error, unable to fetch report
 */
router.get('/showDailyReport', isLoggedIn, reportController.getDailyReport);

/**
 * @swagger
 * paths:
 *   /report/v1/predictTransaction:
 *     get:
 *       summary: Predicts transaction counts
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
 *           description: The ID of the branch for transaction prediction
 *         - in: query
 *           name: startDate
 *           schema:
 *             type: string
 *             format: date-time
 *           required: true
 *           description: The start date for prediction in YYYY-MM-DD
 *         - in: query
 *           name: endDate
 *           schema:
 *             type: string
 *             format: date-time
 *           required: true
 *           description: The end date for prediction in YYYY-MM-DD
 *       responses:
 *         200:
 *           description: Transaction prediction data
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     Tanggal:
 *                       type: string
 *                       example: '2023-10-15'
 *                     Shift:
 *                       type: integer
 *                       example: 1
 *                     Jumlah Transaksi:
 *                       type: integer
 *                       example: 18
 *                     Prev_Week_Transactions:
 *                       type: integer
 *                       example: 21
 *                     Holiday:
 *                       type: boolean
 *                       example: false
 *                     Weekend:
 *                       type: boolean
 *                       example: true
 *                     DayType:
 *                       type: string
 *                       example: 'Weekend'
 *                     Months:
 *                       type: integer
 *                       example: 10
 *                     Days:
 *                       type: integer
 *                       example: 6
 *                     Ramadhan:
 *                       type: boolean
 *                       example: false
 *         400:
 *           description: Bad request, parameter missing or incorrect
 *         401:
 *            description: Unauthorized due to Token Problem
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: true
 *                    message:
 *                      type: string
 *                      example: "Unauthorized: Token expired"
 *         500:
 *           description: Internal server error, unable to predict transactions
 */
router.get('/predictTransaction', isLoggedIn, reportController.predictTransaction);

module.exports = router;
