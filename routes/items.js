/**
 *  @swagger
 *  components:
 *    schemas:
 *      Item:
 *        type: object
 *        required:
 *          - count
 *          - menuid
 *          - pricingcategory
 *          - transactionid
 *        properties:
 *          count:
 *            type: number
 *            description: The quantity of items
 *          menuid:
 *            type: number
 *            description: The unique identifier for the menu item
 *          pricingcategory:
 *            type: string
 *            description: The pricing category for the item
 *          transactionid:
 *            type: number
 *            description: The unique identifier of the transaction
 *        example:
 *          count: 2
 *          menuid: 4
 *          pricingcategory: 'base'
 *          transactionid: 1
 *      addItems:
 *        type: object2
 *        required:
 *          - count
 *          - menuid
 *          - pricingcategory
 *          - transactionid
 *        properties:
 *          count:
 *            type: number
 *            description: Count of the item
 *          menuid:
 *            type: number
 *            description: id of the menu
 *          pricingcategory:
 *            type: string
 *            description: category of the pricing
 *          transactionid:
 *            type: number
 *            description: id of the transaction
 *        example:
 *          count: 1
 *          menuid: 4
 *          pricingcategory: base
 *          transactionid: 5
 *      updateItems:
 *        type: object
 *        required:
 *          - id
 *          - count
 *          - pricingcategory
 *        properties:
 *          id:
 *            type: integer
 *            description: Employee ID
 *          count:
 *            type: number
 *            description: Count of the item
 *          pricingcategory:
 *            type: string
 *            description: category of the pricing
 *        example:
 *          id: 10
 *          count: 3
 *          pricingcategory: online
 *      showSingleDelItem:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: integer
 *            description: ItemID
 */

/**
 *  @swagger
 *  tags:
 *    - name: Item
 *      description: Operations about Item
 */
const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const itemsController = require('../controllers/items.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /item/v1/showItems:
 *      get:
 *        summary: Returns a list of Items
 *        tags:
 *          - Item
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: transactionId
 *            schema:
 *              type: string
 *            description: Find items data based on transaction id
 *        responses:
 *          200:
 *            description: Item Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: item data retrieved successfully
 *                  itemData:
 *                    - id: 1
 *                      count: 3
 *                      price: 5000
 *                      totalprice: 15000
 *                      menuid: 3
 *                      transactionId: 4
 *                      category: Menu Utama
 *                      pricingcategory: base
 *          404:
 *            description: Item not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Item not found
 *          500:
 *            description: Failed to Fetch Item
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to fetch Item data
 */
router.get('/showItems', isLoggedIn, itemsController.showItems);

/**
 *  @swagger
 *  paths:
 *    /item/v1/addItems:
 *      post:
 *        summary: Adds an array of items
 *        tags:
 *          - Item
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addItem'
 *        responses:
 *          200:
 *            description: Item added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: Item added
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
 *            description: Item add Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to add Employee
 */
router.post('/addItems', isLoggedIn, itemsController.addItems);

/**
 *  @swagger
 *  paths:
 *    /item/v1/deleteItem:
 *      post:
 *        summary: Deletes Items by ID
 *        tags:
 *          - Item
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelEmployee'
 *        responses:
 *          200:
 *            description: Employee deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: Employee deleted
 *          500:
 *            description: Employee deletion failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to delete Employee
 */
router.post('/deleteItems', isLoggedIn, itemsController.deleteItems);
router.post('/updateItems', isLoggedIn, itemsController.updateItems);
module.exports = router;
