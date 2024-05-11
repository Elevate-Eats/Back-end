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
 *      AdvancedSummaryData:
 *        type: object
 *        properties:
 *          sumTotalsales:
 *            type: number
 *            format: double
 *            description: The total sales aggregated over the specified period.
 *          sumTransactions:
 *            type: integer
 *            description: The total number of transactions aggregated over the specified period.
 *          sumItemsSold:
 *            type: integer
 *            description: The total number of items sold aggregated over the specified period.
 *        example:
 *          sumTotalsales: 150000.00
 *          sumTransactions: 50
 *          sumItemsSold: 120
 *      AdvancedItemsSummaryData:
 *        type: object
 *        properties:
 *          menuId:
 *            type: integer
 *            description: The identifier of the menu item.
 *          sumTotalSales:
 *            type: number
 *            format: double
 *            description: The total sales aggregated for this menu item over the specified period.
 *          sumItemsSold:
 *            type: integer
 *            description: The total number of items sold aggregated over the specified period.
*        example:
 *          menuId: 1
 *          sumTotalSales: 46000.00
 *          sumItemsSold: 3
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
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/DailySummaryData'
 *          400:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: true
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
 *          401:
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
 *          - in: query
 *            name: menuId
 *            schema:
 *              type: integer
 *        responses:
 *          200:
 *            description: Daily items analytics data fetched successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/DailyItemsAnalyticsData'
 *          400:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: true
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
 *          401:
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
 *          500:
 *            description: Server error
 */
router.get('/showItemsSummary', isLoggedIn, analyticsController.showItemsSummary);

/**
 *  @swagger
 *  paths:
 *    /analytics/v1/showAdvancedSummary:
 *      get:
 *        summary: Fetch advanced summary analytics for a specific branch within a date range
 *        tags:
 *          - Analytics
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: companyId
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
 *            description: Advanced data fetched successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AdvancedSummaryData'
 *          400:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: true
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
 *          401:
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
 *          500:
 *            description: Server error
 */
router.get('/showAdvancedSummary', isLoggedIn, analyticsController.showAdvancedSummary);

/**
 *  @swagger
 *  paths:
 *    /analytics/v1/showAdvancedItemsSummary:
 *      get:
 *        summary: Fetch daily items summary analytics for a specific branch within a date range
 *        tags:
 *          - Analytics
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: companyId
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
 *          - in: query
 *            name: menuId
 *            schema:
 *              type: integer
 *        responses:
 *          200:
 *            description: Advanced items analytics data fetched successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/AdvancedItemsSummaryData'
 *          400:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: true
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
 *          401:
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
 *          500:
 *            description: Server error
 */
router.get('/showAdvancedItemsSummary', isLoggedIn, analyticsController.showAdvancedItemsSummary);

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
 *            application/json:
 *              schema:
 *                type: object
 *                required:
 *                  - transactionId
 *                properties:
 *                  transactionId:
 *                    type: integer
 *                    description: The ID of the transaction to record
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
 *                      example: false
 *                    message:
 *                      type: string
 *                      example: "Transaction Recorded: Succeed"
 *          400:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: true
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
 *          401:
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
 *          500:
 *            description: Server error
 */
router.post('/recordTransaction', isLoggedIn, analyticsController.recordTransaction);

module.exports = router;
