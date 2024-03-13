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
 *          name: Sate
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
 *      post:
 *        summary: Returns a list of menus
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showMenusB'
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
 *                    - menuid : 4,
 *                      branchid : 12,
 *                      name: Sate Tegal 10 Tusuk Campur,
 *                      category: Menu Utama,
 *                      baseprice: 56000,
 *                      baseonlineprice: 60000
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
router.post('/showMenus', isLoggedIn, menuBranchController.showMenus);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/showSingleMenu:
 *      post:
 *        summary: Returns a single menu by ID
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelMenuB'
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
 *                    - menuid : 4,
 *                      branchid : 12,
 *                      name: Sate Tegal 10 Tusuk Campur,
 *                      category: Menu Utama,
 *                      baseprice: 56000,
 *                      baseonlineprice: 60000
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
router.post('/showSingleMenu', isLoggedIn, menuBranchController.showSingleMenu);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/addMenu:
 *      post:
 *        summary: Adds a new Menu
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
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
router.post('/addMenu', isLoggedIn, menuBranchController.addMenu);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/updateMenu:
 *      post:
 *        summary: Updates an existing menu
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
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
 *                  message: Menu updated!
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
 *            description: Menu update failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to update Menu, Server Error
 */
router.post('/updateMenu', isLoggedIn, menuBranchController.updateMenu);

/**
 *  @swagger
 *  paths:
 *    /menuBranch/v1/deleteMenu:
 *      post:
 *        summary: Deletes a menu by ID
 *        tags:
 *          - menuBranch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
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
 *                  message: Menu Deleted!
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
 *            description: Menu deletion failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to delete Menu, Server Error
 */
router.post('/deleteMenu', isLoggedIn, menuBranchController.deleteMenus);
module.exports = router;
