/**
 *  @swagger
 *  components:
 *    schemas:
 *      showSingleDelManager:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: integer
 *            description: Manager ID
 *      addManager:
 *        type: object
 *        required:
 *          - name
 *          - nickname
 *          - phone
 *          - role
 *          - email
 *          - branchAccess
 *          - password
 *          - passwordConfirm
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the Manager
 *          nickname:
 *            type: string
 *            description: Nickname of the Manager
 *          phone:
 *            type: string
 *            description: Your Phone Number
 *            example: "+6281122445566"
 *          role:
 *            type: string
 *            description: Manager Role in Company
 *            enum: [general_manager, area_manager, store_manager]
 *          email:
 *            type: string
 *            format: email
 *            example: user@example.com
 *            description: Your Email
 *          branchAccess:
 *            type: string
 *            description: Branch Access of the Manager
 *            example: "{all}"
 *          password:
 *            type: string
 *            description: Your Password
 *            format: password
 *          passwordConfirm:
 *            type: string
 *            description: Confirm Your Password
 *            format: password
 *      updateManager:
 *        type: object
 *        required:
 *          - id
 *          - name
 *          - nickname
 *          - phone
 *          - role
 *          - email
 *          - branchAccess
 *        properties:
 *          id:
 *            type: integer
 *            description: Manager ID
 *          name:
 *            type: string
 *            description: Name of the Manager
 *          nickname:
 *            type: string
 *            description: Nickname of the Manager
 *          phone:
 *            type: string
 *            description: Your Phone Number
 *            example: "+6281122445566"
 *          role:
 *            type: string
 *            description: Manager Role in Company
 *            enum: [general_manager, area_manager, store_manager]
 *          email:
 *            type: string
 *            format: email
 *            example: user@example.com
 *            description: Your Email
 *          branchAccess:
 *            type: string
 *            description: Branch Access of the Manager
 *            example: "{all}"
 */

/**
 *  @swagger
 *  tags:
 *    - name: Manager
 *      description: Operations about manager
 */

const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const managerController = require('../controllers/manager.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /manager/v1/showManagers:
 *      get:
 *        summary: Returns a list of managers
 *        tags:
 *          - Manager
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Keyword to search managers
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Limit the number of managers returned
 *        responses:
 *          200:
 *            description: Managers data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Manager Data Fetch: Succeed"
 *                  managerData: [...]
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
 *            description: No managers found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Manager Data Fetch: No Data Found"
 *          500:
 *            description: Server error fetching managers
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show All Managers"
 */
router.get('/showManagers', isLoggedIn, managerController.showManagers);

/**
 *  @swagger
 *  paths:
 *    /manager/v1/showSingleManager:
 *      post:
 *        summary: Returns a single manager by ID
 *        tags:
 *          - Manager
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelManager'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelManager'
 *        responses:
 *          200:
 *            description: Manager data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Manager Data Fetch: Succeed"
 *                  managerData: {...}
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
 *            description: Manager not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Manager not found"
 *          500:
 *            description: Server error fetching manager data
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Single Manager"
 */
router.post('/showSingleManager', isLoggedIn, managerController.showSingleManager);

/**
 *  @swagger
 *  paths:
 *    /manager/v1/addManager:
 *      post:
 *        summary: Adds a new manager
 *        tags:
 *          - Manager
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/addManager'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addManager'
 *        responses:
 *          200:
 *            description: Manager added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Create Manager: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation / Email Used"
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
 *            description: Server error adding manager
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Create Manager"
 */
router.post('/addManager', isLoggedIn, managerController.createManager);

/**
 *  @swagger
 *  paths:
 *    /manager/v1/deleteManager:
 *      post:
 *        summary: Deletes a manager by ID
 *        tags:
 *          - Manager
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelManager'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelManager'
 *        responses:
 *          200:
 *            description: Manager deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Delete Manager: Succeed"
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
 *            description: Server error deleting manager
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Failed delete Manager"
 */
router.post('/deleteManager', isLoggedIn, managerController.deleteManager);

/**
 *  @swagger
 *  paths:
 *    /manager/v1/updateManager:
 *      post:
 *        summary: Updates an existing manager
 *        tags:
 *          - Manager
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateManager'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateManager'
 *        responses:
 *          200:
 *            description: Manager updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Update Manager: Succeed"
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
 *            description: Server error updating manager
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Manager"
 */
router.post('/updateManager', isLoggedIn, managerController.updateManager);

module.exports = router;
