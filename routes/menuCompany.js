/**
 *  @swagger
 *  components:
 *    schemas:
 *      addMenu:
 *        type: object
 *        required:
 *          - name
 *          - category
 *          - basePrice
 *          - baseOnlinePrice
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the Menu
 *          category:
 *            type: string
 *            description: Category of the Menu
 *          basePrice:
 *            type: number
 *            description: Base Price of The Menu
 *          baseOnlinePrice:
 *            type: number
 *            description: Base Online Price of The Menu
 *        example:
 *          name: Sate
 *          category: Menu Utama
 *          basePrice: 57000
 *          baseOnlinePrice: 60000
 *      updateMenu:
 *        type: object
 *        required:
 *          - id
 *          - name
 *          - category
 *          - basePrice
 *          - baseOnlinePrice
 *        properties:
 *          id:
 *            type: number
 *            description: Id of the Menu
 *          name:
 *            type: string
 *            description: Name of the Menu
 *          category:
 *            type: string
 *            description: Category of the Menu
 *          basePrice:
 *            type: number
 *            description: Base Price of The Menu
 *          baseOnlinePrice:
 *            type: number
 *            description: Base Online Price of The Menu
 *        example:
 *          id: 1
 *          name: Sate
 *          category: Menu Utama
 *          basePrice: 57000
 *          baseOnlinePrice: 60000
 *      showSingleDelMenu:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: integer
 *            description: menuID
 */

/**
 *  @swagger
 *  tags:
 *    - name: menuCompany
 *      description: Operations about Menu in Company Level
 */

const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const menuCompanyController = require('../controllers/menuCompany.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /menuCompany/v1/showMenus:
 *      get:
 *        summary: Returns a list of menus
 *        tags:
 *          - menuCompany
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Keyword to search menus
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Limit the number of menus returned
 *        responses:
 *          200:
 *            description: Menus data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Menu Data Fetch: Succeed"
 *                  menuData: [...]
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
 *            description: No menus found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Menu Data Fetch: No Data Found"
 *          500:
 *            description: Server error fetching menus
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Menus"
 */
router.get('/showMenus', isLoggedIn, menuCompanyController.showMenus);

/**
 *  @swagger
 *  paths:
 *    /menuCompany/v1/showSingleMenu:
 *      post:
 *        summary: Returns a single menu by ID
 *        tags:
 *          - menuCompany
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenu'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenu'
 *        responses:
 *          200:
 *            description: Menu data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Menu Data Fetch: Succeed"
 *                  menuData: {...}
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
 *            description: Menu not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Menu not found"
 *          500:
 *            description: Server error fetching menu data
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Single Menu"
 */
router.post('/showSingleMenu', isLoggedIn, menuCompanyController.showSingleMenu);

/**
 *  @swagger
 *  paths:
 *    /menuCompany/v1/addMenu:
 *      post:
 *        summary: Adds a new menu
 *        tags:
 *          - menuCompany
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/addMenu'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addMenu'
 *        responses:
 *          200:
 *            description: Menu added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Create Menu: Succeed"
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
 *            description: Server error adding menu
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Create Menu"
 */
router.post('/addMenu', isLoggedIn, menuCompanyController.addMenu);

/**
 *  @swagger
 *  paths:
 *    /menuCompany/v1/updateMenu:
 *      post:
 *        summary: Updates an existing menu
 *        tags:
 *          - menuCompany
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateMenu'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateMenu'
 *        responses:
 *          200:
 *            description: Menu updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Update Menu: Succeed"
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
 *            description: Server error updating menu
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Menu"
 */
router.post('/updateMenu', isLoggedIn, menuCompanyController.updateMenu);

/**
 *  @swagger
 *  paths:
 *    /menuCompany/v1/deleteMenu:
 *      post:
 *        summary: Deletes a menu by ID
 *        tags:
 *          - menuCompany
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenu'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenu'
 *        responses:
 *          200:
 *            description: Menu deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Delete Menu: Succeed"
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
 *            description: Server error deleting menu
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Delete Menu"
 */
router.post('/deleteMenu', isLoggedIn, menuCompanyController.deleteMenus);
module.exports = router;
