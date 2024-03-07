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
 *            description: Find Menu Data base of Keyword
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Show limited Number of Menus
 *        responses:
 *          200:
 *            description: Menu Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: menuData retrieved successfully
 *                  MenuData:
 *                    - id: 1
 *                      name: "Sate"
 *                      category: "Menu Utama"
 *          404:
 *            description: Menu not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Menu not found
 *          500:
 *            description: Failed to Fetch Menu
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to show Menus, Server Error
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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenu'
 *        responses:
 *          200:
 *            description: A single menu object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: MenuData retrieved successfully
 *                  menuData:
 *                    name: Sate
 *                    category: Menu Utama
 *                    basePrice: 57000
 *                    baseOnlinePrice: 60000
 *          404:
 *            description: Menu not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Menu not found
 *          500:
 *            description: Fetch Data Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to show Menu, Server Error
 */
router.post('/showSingleMenu', isLoggedIn, menuCompanyController.showSingleMenu);

/**
 *  @swagger
 *  paths:
 *    /menuCompany/v1/addMenu:
 *      post:
 *        summary: Adds a new Menu
 *        tags:
 *          - menuCompany
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
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
 *                  message: Menu added succesfully
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
 *            description: Menu add Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to addMenu, Server Error
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
 *                  message: Menu updated!
 *          500:
 *            description: Menu update failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to update Menu, Server Error
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
 *                  message: Menu Deleted!
 *          500:
 *            description: Menu deletion failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to delete Menu, Server Error
 */
router.post('/deleteMenu', isLoggedIn, menuCompanyController.deleteMenus);
module.exports = router;
