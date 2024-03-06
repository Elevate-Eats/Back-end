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
 *        summary: Returns a list of Manager
 *        tags:
 *          - Manager
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Find Manager Data base of Keyword
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Show limited Number of Managers
 *        responses:
 *          200:
 *            description: Manager Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: manager data retrieved successfully
 *                  managerData:
 *                    - id: 1
 *                      name: "Santoso"
 *                      phone: "+6281122445566"
 *                      email: "user@example.com"
 *                      role: general_manager
 *          404:
 *            description: Manager not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: manager not found
 *          500:
 *            description: Failed to Fetch Manager
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to retrieve manager data
 */
router.get('/showManagers', isLoggedIn, managerController.showAllManager);

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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelManager'
 *        responses:
 *          200:
 *            description: A single manager object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: Manager data retrieved successfully
 *                  managerData:
 *                    id: 10
 *                    name: John Doe
 *                    phone: "+6281122445566"
 *                    email: user@example.com
 *                    role: general_manager
 *                    branchAccess: "{all}"
 *          404:
 *            description: Manager not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Manager not found
 *          500:
 *            description: Fetch Data Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to retrieve branch data
 */
router.post('/showSingleManager', isLoggedIn, managerController.showSingleManager);

/**
 *  @swagger
 *  paths:
 *    /manager/v1/addManager:
 *      post:
 *        summary: Adds a new Manager
 *        tags:
 *          - Manager
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
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
 *                  message: Manager added
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
 *          409:
 *            description: Email already used
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Email already used
 *          500:
 *            description: Manager add Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to add Manager
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
 *                  message: Manager deleted
 *          500:
 *            description: Employee deletion failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed delete Manager
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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateManager'
 */
router.post('/updateManager', isLoggedIn, managerController.updateManager);

module.exports = router;
