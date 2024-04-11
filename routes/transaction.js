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
 *          tablenumber:
 *            type: number
 *            description: Number of the table
 *            nullable: true
 *        example:
 *          transactiondate: "2024-03-15T14:30:00Z"
 *          discount: 10
 *          status: 0
 *          paymentmethod: 1
 *          totalprice: 50000
 *          branchid: 1
 *          customername: "Alice Johnson"
 *          tablenumber: 5
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
 *          tablenumber:
 *            type: number
 *            description: Number of the table
 *            nullable: true
 *        example:
 *          transactiondate: 2024-03-15T14:30:00
 *          discount: 10
 *          status: 1
 *          paymentmethod: 2
 *          totalprice: 50000
 *          branchid: 12
 *          customername: Alice Johnson
 *          tableNumber: 5
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
 *            description: Find Transaction Data base of Keyword
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Show limited Number of Transaction
 *          - in: query
 *            name: branch
 *            schema:
 *              type: integer
 *            description: Show transactions in a branch (id)
 *          - in: query
 *            name: status
 *            schema:
 *              type: integer
 *            description: Show transactions based on status (0,1)
 *        responses:
 *          200:
 *            description: Transaction Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: transaction data retrieved successfully
 *                  transactionData:
 *                    - id: 1
 *                      transactiondate: "2024-03-15T07:30:00.000Z"
 *                      discount: 10
 *                      status: 1
 *                      paymentmethod: 2
 *                      totalprice: 500
 *                      branchid: 12
 *                      customername: "Alice Johnson"
 *          404:
 *            description: transaction not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: transaction not found
 *          500:
 *            description: Failed to Fetch transaction
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to retrieve transaction data
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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelTransaction'
 *        responses:
 *          200:
 *            description: A single transaction object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: Transaction data retrieved successfully
 *                  transactionData:
 *                    - transactiondate: "2024-03-15T07:30:00.000Z"
 *                      discount: 10
 *                      status: 1
 *                      paymentmethod: 2
 *                      totalprice: 500
 *                      branchid: 12
 *                      customername: "Alice Johnson"
 *          404:
 *            description: Transaction not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: transaction not found
 *          500:
 *            description: Fetch Data Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to retrieve Transaction data
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
 *                  message: Transaction added
 *          400:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Validation Error
 *                  details: Error Message from API
 *          500:
 *            description: Transaction add Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to add Transaction
 */
router.post('/addTransaction', isLoggedIn, transactionController.addTransaction);

/**
 *  @swagger
 *  paths:
 *    /transaction/v1/deleteTransaction:
 *      post:
 *        summary: Deletes a Transacton by ID
 *        tags:
 *          - Transaction
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
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
 *                  message: Transaction deleted
 *          500:
 *            description: Transaction deletion failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed delete Transaction
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
 *                  message: Transaction updated
 *          400:
 *            description: Validation Error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Validation Error
 *                  details: Error Message from API
 *          500:
 *            description: Transaction update Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to update Transaction
 */
router.post('/updateTransaction', isLoggedIn, transactionController.updateTransaction);

module.exports = router;
