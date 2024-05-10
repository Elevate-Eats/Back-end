/**
 *  @swagger
 *  components:
 *    schemas:
 *      addMenuB:
 *        type: object
 *        required:
 *          - menuId
 *          - branchId
 *          - name
 *          - category
 *          - basePrice
 *          - baseOnlinePrice
 *        properties:
 *          menuId:
 *            type: number
 *            description: Menu id on the Branch
 *          branchId:
 *            type: number
 *            description: Branch of the Menu
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
 *          menuId: 1
 *          branchId: 1
 *          name: Sate Kambing
 *          category: Menu Utama
 *          basePrice: 57000
 *          baseOnlinePrice: 60000
 *      updateMenuB:
 *        type: object
 *        required:
 *          - menuId
 *          - branchId
 *          - name
 *          - category
 *          - basePrice
 *          - baseOnlinePrice
 *        properties:
 *          menuId:
 *            type: number
 *            description: Menu id on the Branch
 *          branchId:
 *            type: number
 *            description: Branch of the Menu
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
 *          menuId: 1
 *          branchId: 2
 *          name: Sate
 *          category: Menu Utama
 *          basePrice: 57000
 *          baseOnlinePrice: 60000
 *      showSingleDelMenuB:
 *        type: object
 *        required:
 *          - menuId
 *          - branchId
 *        properties:
 *          menuId:
 *            type: number
 *            description: Menu id on the Branch
 *          branchId:
 *            type: number
 *            description: Branch of the Menu
 *      showMenusB:
 *        type: object
 *        required:
 *          - branchId
 *          - search
 *          - limit
 *        properties:
 *          branchId:
 *            type: number
 *            description: Branch of the Menu
 *          search:
 *            type: string
 *            description: Search menu
 *          limit:
 *            type: number
 *            description: Limit list of menus
 */

/**
 *  @swagger
 *  tags:
 *    - name: menuBranch
 *      description: Operations about Menu in Branch Level
 */

const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const menuBranchController = require('../controllers/menuBranch.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/showMenus:
 *      get:
 *        summary: Returns a list of menus within a specific branch
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Keyword to search within menu names
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Maximum number of menus to return
 *          - in: query
 *            name: branchid
 *            schema:
 *              type: integer
 *            description: ID of the branch to filter menus
 *        responses:
 *          200:
 *            description: Successfully retrieved list of menus
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Menu data retrieved successfully"
 *                  MenuData: [...]
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
 *                  message: "No menus found"
 *          500:
 *            description: Server error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Failed to fetch menus"
 */
router.get('/showMenus', isLoggedIn, menuBranchController.showMenus);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/showSingleMenu:
 *      post:
 *        summary: Returns a single menu by ID within a specific branch
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenuB'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenuB'
 *        responses:
 *          200:
 *            description: Successfully retrieved menu details
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Menu data retrieved successfully"
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
 *                  message: "Failed to fetch menu data"
 */
router.post('/showSingleMenu', isLoggedIn, menuBranchController.showSingleMenu);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/addMenu:
 *      post:
 *        summary: Adds a new menu to a specific branch
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/addMenuB'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addMenuB'
 *        responses:
 *          200:
 *            description: Menu added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Menu added successfully"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Validation error"
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
 *                  message: "Failed to add menu"
 */
router.post('/addMenu', isLoggedIn, menuBranchController.addMenu);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/updateMenu:
 *      post:
 *        summary: Updates an existing menu within a branch
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateMenuB'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateMenuB'
 *        responses:
 *          200:
 *            description: Menu updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Menu updated successfully"
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
 *                  message: "Failed to update menu"
 */
router.post('/updateMenu', isLoggedIn, menuBranchController.updateMenu);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/deleteMenu:
 *      post:
 *        summary: Deletes a menu from a specific branch
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenuB'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenuB'
 *        responses:
 *          200:
 *            description: Menu deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Menu deleted successfully"
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
 *                  message: "Failed to delete menu"
 */
router.post('/deleteMenu', isLoggedIn, menuBranchController.deleteMenu);
module.exports = router;
