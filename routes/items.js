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
 *      DeleteItems:
 *        type: object
 *        required:
 *          - itemIds
 *        properties:
 *          itemIds:
 *            type: array
 *            items:
 *              type: number
 *            description: Array of item IDs to delete
 *        example:
 *          itemIds: [1, 2, 3]
 *      UpdateItem:
 *        type: object
 *        required:
 *          - id
 *          - count
 *          - pricingcategory
 *        properties:
 *          id:
 *            type: number
 *            description: The unique identifier for the item
 *          count:
 *            type: number
 *            description: The updated count of items
 *          pricingcategory:
 *            type: string
 *            description: The updated pricing category for the item
 *        example:
 *          id: 1
 *          count: 4
 *          pricingcategory: 'base'
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
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Item'
 *              examples:
 *                arrayExample:
 *                  summary: An array of items
 *                  value:
 *                    - count: 2
 *                      menuid: 4
 *                      pricingcategory: 'base'
 *                      transactionid: 1
 *                    - count: 3
 *                      menuid: 5
 *                      pricingcategory: 'online'
 *                      transactionid: 2
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
 * @swagger
 *  paths:
 *    /items/v1/deleteItems:
 *      post:
 *        summary: Delete multiple items
 *        tags:
 *          - Item
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DeleteItems'
 *        responses:
 *          200:
 *            description: Items deleted successfully
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
 *                      example: 'Items deleted successfully'
 *          400:
 *            description: Validation error
 *          500:
 *            description: Server error
 */
router.post('/deleteItems', isLoggedIn, itemsController.deleteItems);

/**
 * @swagger
 *    /items/v1/updateItems:
 *      post:
 *        summary: Update multiple items
 *        tags:
 *          - Item
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/UpdateItem'
 *        responses:
 *          200:
 *            description: Items updated successfully
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
 *                      example: 'Items updated successfully'
 *          400:
 *            description: Validation error
 *          500:
 *            description: Server error
 */
router.post('/updateItems', isLoggedIn, itemsController.updateItems);
module.exports = router;
