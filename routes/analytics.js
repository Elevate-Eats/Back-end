/**
 *  @swagger
 *  components:
 *    schemas:
 *      DailySummaryData:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          date:
 *            type: string
 *            format: date
 *          companyid:
 *            type: integer
 *          branchid:
 *            type: integer
 *          totalsales:
 *            type: number
 *            format: double
 *          numberoftransactions:
 *            type: integer
 *          numberofitemssold:
 *            type: integer
 *        example:
 *          id: 1
 *          date: "2023-01-01"
 *          companyid: 1
 *          branchid: 1
 *          totalsales: 50000.00
 *          numberoftransactions: 10
 *          numberofitemssold: 20
 *      DailyItemsAnalyticsData:
 *        type: object
 *        properties:
 *          id:
 *            type: integer
 *          date:
 *            type: string
 *            format: date
 *          companyid:
 *            type: integer
 *          branchid:
 *            type: integer
 *          menuid:
 *            type: integer
 *          numberofitemssold:
 *            type: integer
 *          totalsales:
 *            type: number
 *            format: double
 *        example:
 *          id: 1
 *          date: "2023-01-01"
 *          companyid: 1
 *          branchid: 1
 *          menuid: 5
 *          numberofitemssold: 15
 *          totalsales: 30000.00
 */
const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const analyticsController = require('../controllers/analytics.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /analytics/v1/showDailySummary:
 *      get:
 *        summary: Fetch daily summary analytics for a specific branch within a date range
 *        tags:
 *          - Analytics
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: companyId
 *            required: true
 *            schema:
 *              type: integer
 *          - in: query
 *            name: branchId
 *            schema:
 *              type: integer
 *          - in: query
 *            name: startDate
 *            schema:
 *              type: string
 *              format: date
 *          - in: query
 *            name: endDate
 *            schema:
 *              type: string
 *              format: date
 *        responses:
 *          200:
 *            description: Daily summary data fetched successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                    message:
 *                      type: string
 *                    data:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/DailySummaryData'
 *          500:
 *            description: Server error
 */

router.get('/showDailySummary', isLoggedIn, analyticsController.showDailySummary);

/**
 *  @swagger
 *  paths:
 *    /analytics/v1/showItemsSummary:
 *      get:
 *        summary: Fetch daily items summary analytics for a specific branch within a date range
 *        tags:
 *          - Analytics
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: companyId
 *            required: true
 *            schema:
 *              type: integer
 *          - in: query
 *            name: branchId
 *            schema:
 *              type: integer
 *          - in: query
 *            name: startDate
 *            schema:
 *              type: string
 *              format: date
 *          - in: query
 *            name: endDate
 *            schema:
 *              type: string
 *              format: date
 *        responses:
 *          200:
 *            description: Daily items analytics data fetched successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                    message:
 *                      type: string
 *                    data:
 *                      type: array
 *                      items:
 *                        $ref: '#/components/schemas/DailyItemsAnalyticsData'
 *          500:
 *            description: Server error
 */
router.get('/showItemsSummary', isLoggedIn, analyticsController.showItemsSummary);

/**
 *  @swagger
 *  paths:
 *    /analytics/v1/recordTransaction:
 *      post:
 *        summary: Record a completed transaction
 *        tags:
 *          - Analytics
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                type: object
 *                required:
 *                  - transactionId
 *                properties:
 *                  transactionId:
 *                    type: integer
 *                    description: The ID of the transaction to record
 *        responses:
 *          200:
 *            description: Transaction recorded successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                    message:
 *                      type: string
 *                example:
 *                  error: false
 *                  message: transaction recorded
 *          500:
 *            description: Server error
 */
router.post('/recordTransaction', isLoggedIn, analyticsController.recordTransaction);

module.exports = router;
