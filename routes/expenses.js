/**
 * @swagger
 * tags:
 *   - name: Expense
 *     description: Operations about expenses
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddExpense:
 *       type: object
 *       required:
 *         - name
 *         - count
 *         - date
 *         - notes
 *         - total
 *         - category
 *         - branchId
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the expense
 *         count:
 *           type: number
 *           description: Count of items or services purchased
 *         price:
 *           type: number
 *           description: price of items or services purchased
 *         total:
 *           type: number
 *           description: total price of items or services purchased
 *         date:
 *           type: string
 *           format: date
 *           description: Date of the expense
 *         notes:
 *           type: string
 *           description: Additional notes regarding the expense
 *         category:
 *           type: string
 *           description: Category of the expense
 *         branchId:
 *           type: string
 *           description: Branch identifier where the expense occurred
 *       example:
 *         name: Office Supplies
 *         count: 2
 *         price: 150000
 *         total: 300000
 *         date: "2023-08-01"
 *         notes: "Purchased new stationery"
 *         category: "Supplies"
 *         branchId: "1"
 *     UpdateExpense:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - count
 *         - price
 *         - total
 *         - date
 *         - notes
 *         - category
 *         - branchId
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the expense
 *         name:
 *           type: string
 *           description: Name of the expense
 *         count:
 *           type: number
 *           description: Count of items or services purchased
 *         price:
 *           type: number
 *           description: price of items or services purchased
 *         total:
 *           type: number
 *           description: total price of items or services purchased
 *         date:
 *           type: string
 *           format: date
 *           description: Date when the expense was incurred
 *         notes:
 *           type: string
 *           description: Additional notes regarding the expense
 *         category:
 *           type: string
 *           description: Category of the expense
 *         branchId:
 *           type: string
 *           description: Branch identifier where the expense occurred
 *       example:
 *         id: 1
 *         name: Office Supplies
 *         count: 3
 *         price: 150000
 *         total: 300000
 *         date: "2023-08-15"
 *         notes: "Updated stationery purchase"
 *         category: "Supplies"
 *         branchId: "1"
 *     ShowSingleDelExpense:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the expense
 *       example:
 *         id: 1
 */

const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const expenseController = require('../controllers/expenses.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /expense/v1/showExpenses:
 *      get:
 *        summary: Returns a list of all expenses
 *        tags:
 *          - Expense
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: branchId
 *            schema:
 *              type: string
 *            required: true
 *            description: Branch identifier to filter expenses
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Keyword to search name of the expense
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Limit the number of expenses returned
 *        responses:
 *          200:
 *            description: Expenses data retrieved successfully
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
 *                      example: "Expenses data fetch: Succeed"
 *                    expense:
 *                      example: {...}

 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *          500:
 *            description: Server error fetching expenses
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Expenses"
 */
router.get('/showExpenses', isLoggedIn, expenseController.showExpenses);

/**
 *  @swagger
 *  paths:
 *    /expense/v1/showSingleExpense:
 *      post:
 *        summary: Returns a single expense by ID
 *        tags:
 *          - Expense
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ShowSingleDelExpense'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/ShowSingleDelExpense'
 *        responses:
 *          200:
 *            description: Single expense data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Single Expense data fetch: Succeed"
 *                  expense: {...}
 *          404:
 *            description: Expense not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Expense not found"
 *          500:
 *            description: Server error fetching expense data
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Single Expense"
 */
router.post('/showSingleExpense', isLoggedIn, expenseController.showSingleExpense);

/**
 * @swagger
 * /expense/v1/addExpense:
 *   post:
 *     summary: Adds a new expense
 *     tags: [Expense]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddExpense'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             $ref: '#/components/schemas/AddExpense'
 *     responses:
 *       200:
 *         description: Expense added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "addExpenses: Succeed"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/definitions-response/regularResponse'
 *               example:
 *                 error: true
 *                 message: "Bad Request: Validation"
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/definitions-response/regularResponse'
 *               example:
 *                 error: true
 *                 message: "Server Error: Add Expenses"
 */
router.post('/addExpense', isLoggedIn, expenseController.addExpense);

/**
 *  @swagger
 *  paths:
 *    /expense/v1/deleteExpense:
 *      post:
 *        summary: Deletes an expense by ID
 *        tags:
 *          - Expense
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ShowSingleDelExpense'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/ShowSingleDelExpense'
 *        responses:
 *          200:
 *            description: Expense deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Expense deleted successfully"
 *          500:
 *            description: Server error deleting expense
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Delete Expense"
 */
router.post('/deleteExpense', isLoggedIn, expenseController.deleteExpense);

/**
 *  @swagger
 *  paths:
 *    /expense/v1/updateExpense:
 *      post:
 *        summary: Updates an existing expense
 *        tags:
 *          - Expense
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UpdateExpense'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/UpdateExpense'
 *        responses:
 *          200:
 *            description: Expense updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Update Expense: Succeed"
 *          500:
 *            description: Server error updating expense
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Expense"
 */
router.post('/updateExpense', isLoggedIn, expenseController.updateExpense);

module.exports = router;
