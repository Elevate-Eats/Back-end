/**
 *  @swagger
 *  components:
 *    schemas:
 *      addTransaction:
 *        type: object
 *        required:
 *          - transactiondate
 *          - branchid
 *          - status
 *        properties:
 *          transactiondate:
 *            type: string
 *            format: date-time
 *            description: Date of the transaction
 *          discount:
 *            type: number
 *            description: Total discount
 *            nullable: true
 *          status:
 *            type: number
 *            description: Transaction status, 0 means success, 1 means pending
 *          paymentmethod:
 *            type: number
 *            description: Payment Method of the transaction, 0 means cash, 1 means transfer
 *            nullable: true
 *          totalprice:
 *            type: number
 *            description: Total transaction price
 *            nullable: true
 *          branchid:
 *            type: number
 *            description: ID of the Branch
 *          customername:
 *            type: string
 *            description: Name of the customer
 *            nullable: true
 *          tableNumber:
 *            type: number
 *            description: Number of the table
 *            nullable: true
 *          cashierid:
 *            type: id
 *            description: cashier's id
 *        example:
 *          transactiondate: "2024-03-15T14:30:00Z"
 *          discount: 10
 *          status: 0
 *          paymentmethod: 1
 *          totalprice: 50000
 *          branchid: 1
 *          customername: "Alice Johnson"
 *          tableNumber: 5
 *          cashierid: 3
 *      updateTransaction:
 *        type: object
 *        required:
 *          - id
 *          - transactiondate
 *          - branchid
 *          - status
 *        properties:
 *          id:
 *            type: number
 *            description: id of the transaction
 *          transactiondate:
 *            type: string
 *            format: date-time
 *            description: Date of the transaction
 *          discount:
 *            type: number
 *            description: Total discount
 *            nullable: true
 *          status:
 *            type: number
 *            description: Transaction status, 0 means success, 1 means pending
 *          paymentmethod:
 *            type: number
 *            description: Payment Method of the transaction, 0 means cash, 1 means transfer
 *            nullable: true
 *          totalprice:
 *            type: number
 *            description: Total transaction price
 *            nullable: true
 *          branchid:
 *            type: number
 *            description: ID of the Branch
 *          customername:
 *            type: string
 *            description: Name of the customer
 *            nullable: true
 *          tableNumber:
 *            type: number
 *            description: Number of the table
 *            nullable: true
 *          cashierid:
 *            type: number
 *            description: cashier's id
 *        example:
 *          id: 1
 *          transactiondate: 2024-03-15T14:30:00
 *          discount: 10
 *          status: 1
 *          paymentmethod: 2
 *          totalprice: 50000
 *          branchid: 12
 *          customername: Alice Johnson
 *          tableNumber: 5
 *          cashierid: 3
 *      showSingleDelTransaction:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: number
 *            description: id of the transaction'
 *        example:
 *          id: 4
 */

const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const transactionController = require('../controllers/transaction.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /transaction/v1/showTransactions:
 *      get:
 *        summary: Returns a list of Transactions
 *        tags:
 *          - Transaction
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Keyword to search transactions
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Limit the number of transactions returned
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            description: Page the number of transactions returned
 *          - in: query
 *            name: branch
 *            schema:
 *              type: integer
 *            description: Filter transactions by branch ID
 *          - in: query
 *            name: status
 *            schema:
 *              type: integer
 *            description: Filter transactions based on status (0 for success, 1 for pending)
 *          - in: query
 *            name: startDate
 *            schema:
 *              type: string
 *              format: date
 *            description: Start date to filter transactions (YYYY-MM-DD)
 *          - in: query
 *            name: endDate
 *            schema:
 *              type: string
 *              format: date
 *            description: End date to filter transactions (YYYY-MM-DD); after startdate
 *        responses:
 *          200:
 *            description: Transactions found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Transaction Data Fetch: Succeed"
 *                  transactionData: [...]
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
 *          404:
 *            description: No transactions found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Transaction Data Fetch: No Transactions Found"
 *          500:
 *            description: Failed to fetch transactions
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Transactions"
 */
router.get('/showTransactions', isLoggedIn, transactionController.showTransactions);

/**
 *  @swagger
 *  paths:
 *    /transaction/v1/showSingleTransaction:
 *      post:
 *        summary: Returns a single transaction by ID
 *        tags:
 *          - Transaction
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelTransaction'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelTransaction'
 *        responses:
 *          200:
 *            description: A single transaction retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Transaction Data Fetch: Succeed"
 *                  transactionData: {...}
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
 *          404:
 *            description: Transaction not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Transaction Data Fetch: Not Found"
 *          500:
 *            description: Server error fetching transaction data
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Single Transaction"
 */
router.post('/showSingleTransaction', isLoggedIn, transactionController.showSingleTransaction);

/**
 *  @swagger
 *  paths:
 *    /transaction/v1/addTransaction:
 *      post:
 *        summary: Adds a new Transaction
 *        tags:
 *          - Transaction
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/addTransaction'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addTransaction'
 *        responses:
 *          200:
 *            description: Transaction added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Create Transaction: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["Error message from API"]
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
 *            description: Transaction add failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Add Transaction"
 */
router.post('/addTransaction', isLoggedIn, transactionController.addTransaction);

/**
 *  @swagger
 *  paths:
 *    /transaction/v1/deleteTransaction:
 *      post:
 *        summary: Deletes a Transaction by ID
 *        tags:
 *          - Transaction
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelTransaction'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelTransaction'
 *        responses:
 *          200:
 *            description: Transaction deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Delete Transaction: Succeed"
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
 *            description: Transaction deletion failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Delete Transaction"
 */
router.post('/deleteTransaction', isLoggedIn, transactionController.deleteTransaction);

/**
 *  @swagger
 *  paths:
 *    /transaction/v1/updateTransaction:
 *      post:
 *        summary: Update a Transaction
 *        tags:
 *          - Transaction
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateTransaction'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateTransaction'
 *        responses:
 *          200:
 *            description: Transaction updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Update Transaction: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["Error message from API"]
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
 *            description: Transaction update failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Transaction"
 */
router.post('/updateTransaction', isLoggedIn, transactionController.updateTransaction);

module.exports = router;
