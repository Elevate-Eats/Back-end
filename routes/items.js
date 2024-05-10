/**
 *  @swagger
 *  components:
 *    schemas:
 *      Item:
 *        type: object
 *        required:
 *          - count
 *          - menuId
 *          - pricingCategory
 *          - transactionId
 *          - price
 *          - totalPrice
 *          - category
 *        properties:
 *          count:
 *            type: number
 *            description: The quantity of the item
 *            minimum: 1
 *          menuId:
 *            type: number
 *            description: The identifier for the menu item
 *            minimum: 1
 *          pricingCategory:
 *            type: string
 *            description: Category for pricing, dictates which price to apply
 *          transactionId:
 *            type: number
 *            description: The transaction identifier that this item belongs to
 *            minimum: 1
 *          price:
 *            type: number
 *            description: Price per unit of the item
 *            minimum: 1
 *          totalPrice:
 *            type: number
 *            description: Total price for the item (count * price)
 *            minimum: 1
 *          category:
 *            type: string
 *            description: Category of the item, e.g., appetizer, main course, dessert
 *      ItemsArray:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/Item'
 *        minItems: 1
 *        description: An array of items to be added, each with detailed specifications.
 *      ShowSingleDelItem:
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
 *          - price
 *          - totalPrice
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
 *          price:
 *            type: number
 *            description: Price of the Item
 *          totalPrice:
 *            type: number
 *            description: Total price of the item with the count
 *        example:
 *          id: 1
 *          count: 4
 *          pricingcategory: 'base'
 *          price: 20000
 *          totalPrice: 80000
 *      UpdateItems:
 *        type: array
 *        items:
 *          $ref: '#/components/schemas/UpdateItem'
 *        minItems: 1
 *        description: An array of items to be updated, each with detailed specifications.
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
 *        summary: Returns a list of items linked to a transaction
 *        tags:
 *          - Item
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: transactionId
 *            schema:
 *              type: integer
 *            description: Transaction ID to fetch items for
 *        responses:
 *          200:
 *            description: Items data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Item Data Fetch: Succeed"
 *                  itemData: [...]
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
 *            description: No items found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Item Data Fetch: No Data Found"
 *          500:
 *            description: Server error fetching items
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show All Items"
 */

router.get('/showItems', isLoggedIn, itemsController.showItems);

/**
 *  @swagger
 *  paths:
 *    /item/v1/addItems:
 *      post:
 *        summary: Adds new items to a transaction
 *        tags:
 *          - Item
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ItemsArray'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/ItemsArray'
 *        responses:
 *          200:
 *            description: Items added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Create Items: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
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
 *            description: Server error adding items
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Add Items"
 */
router.post('/addItems', isLoggedIn, itemsController.addItems);

/**
 *  @swagger
 *  paths:
 *    /item/v1/deleteItems:
 *      post:
 *        summary: Deletes specified items
 *        tags:
 *          - Item
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/DeleteItems'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/DeleteItems'
 *        responses:
 *          200:
 *            description: Items deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Delete Items: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation Error"
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
 *            description: Server error deleting items
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Delete Items"
 */
router.post('/deleteItems', isLoggedIn, itemsController.deleteItems);

/**
 *  @swagger
 *  paths:
 *    /item/v1/updateItems:
 *      post:
 *        summary: Updates specified items
 *        tags:
 *          - Item
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UpdateItems'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/UpdateItems'
 *        responses:
 *          200:
 *            description: Items updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Items Updated Successfully"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
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
 *            description: Server error updating items
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Items"
 */
router.post('/updateItems', isLoggedIn, itemsController.updateItems);
module.exports = router;
