/**
 *  @swagger
 *  components:
 *    schemas:
 *      showDelSingleBranch:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: integer
 *            description: Branch ID
 *      addBranch:
 *        type: object
 *        required:
 *          - name
 *          - address
 *          - phone
 *          - managerId
 *        properties:
 *          name:
 *            type: string
 *            description: Branch Name
 *          address:
 *            type: string
 *            description: Branch Address
 *            example: Jl. Godean, Godean, Yogyakarta, DIY
 *          phone:
 *            type: string
 *            description: Manager Phone Number
 *            example: "\uFF0B628533513111"
 *          managerId:
 *            type: integer
 *            description: Manager ID
 *            example: 2
 *        example:
 *          name: Jogja
 *          address: Jl. Godean, Godean, Yogyakarta, DIY
 *          phone: "\uFF0B628533513111"
 *          managerId: 2
 *      updateBranch:
 *        type: object
 *        required:
 *          - id
 *          - name
 *          - address
 *          - phone
 *          - managerId
 *        properties:
 *          id:
 *            type: integer
 *            description: Branch ID
 *          name:
 *            type: string
 *            description: Branch Name
 *          phone:
 *            type: string
 *            description: Manager Phone Number
 *            example: "+628533513111"
 *          address:
 *            type: string
 *            description: Branch Address
 *            example: Jl. Godean, Godean, Yogyakarta, DIY
 *          managerId:
 *            type: integer
 *            description: Manager ID
 *            example: 2
 *        example:
 *          id: 10
 *          name: Jogja
 *          phone: "+628533513111"
 *          address: Jl. Godean, Godean, Yogyakarta, DIY
 *          managerId: 2
 */

/**
 *  @swagger
 *  components:
 *    definitions-response:
 *      showBranches:
 *        type: object
 *        properties:
 *          error:
 *            type: boolean
 *            required: true
 *          message:
 *            type: string
 *            required: true
 *          branchData:
 *            type: array
 *            required: true
 *            items:
 *              type: object
 *              required: true
 *              properties:
 *                id:
 *                  type: integer
 *                  required: true
 *                name:
 *                  type: string
 *                  required: true
 *                address:
 *                  type: string
 *                  required: true
 *      showSingleBranch:
 *        type: object
 *        properties:
 *          error:
 *            type: boolean
 *            required: true
 *          message:
 *            type: string
 *            required: true
 *          branchData:
 *            type: object
 *            required: true
 *            properties:
 *              id:
 *                type: integer
 *                required: true
 *              name:
 *                type: string
 *                required: true
 *              phone:
 *                type: string
 *                description: Your Phone Number
 *                example: "+6281122445566"
 *              address:
 *                type: string
 *                required: true
 *      addBranch:
 *        type: object
 *        properties:
 *          error:
 *            type: boolean
 *            required: true
 *          message:
 *            type: string
 *            required: true
 *      deleteBranch:
 *        type: object
 *        properties:
 *          error:
 *            type: boolean
 *            required: true
 *          message:
 *            type: string
 *            required: true
 *      updateBranch:
 *        type: object
 *        properties:
 *          error:
 *            type: boolean
 *            required: true
 *          message:
 *            type: string
 *            required: true
 */

/**
 *  @swagger
 *  tags:
 *    - name: Branch
 *      description: Branch Operations
 */

const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const branchController = require('../controllers/branch.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /branch/v1/showBranches:
 *      get:
 *        summary: Show Data of All Branches
 *        tags:
 *          - Branch
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Search Parameter for Branches
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Limit for Number of Branches to Retrieve
 *        responses:
 *          200:
 *            description: List of branches retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showBranches'
 *                example:
 *                  error: false
 *                  message: "Branch Data Fetch: Succeed"
 *                  branchData:
 *                    - id: 10
 *                      name: "Jogjakarta"
 *                      address: "Jl. Godean, Godean, Yogyakarta, DIY"
 *                    - id: 11
 *                      name: "Jakarta"
 *                      address: "Jl. Thamrin, Jakarta Pusat"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showBranches'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
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
 *            description: No branches found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showBranches'
 *                example:
 *                  error: true
 *                  message: "Branch Data Fetch: No Data Found"
 *          500:
 *            description: Server error during branch data retrieval
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showBranches'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Branch"
 */
router.get('/showBranches', isLoggedIn, branchController.showBranches);

/**
 *  @swagger
 *  paths:
 *    /branch/v1/showSingleBranch:
 *      post:
 *        summary: Show Data of Single Branch
 *        tags:
 *          - Branch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showDelSingleBranch'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showDelSingleBranch'
 *        responses:
 *          200:
 *            description: Branch data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showSingleBranch'
 *                example:
 *                  error: false
 *                  message: "Branch data Fetch: Succeed"
 *                  branchData: {...}
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
 *            description: Branch not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showSingleBranch'
 *                example:
 *                  error: true
 *                  message: "Branch not found"
 *          500:
 *            description: Server error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showSingleBranch'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Single Branch"
 */
router.post('/showSingleBranch', isLoggedIn, branchController.showSingleBranch);

/**
 *  @swagger
 *  paths:
 *    /branch/v1/addBranch:
 *      post:
 *        summary: Add New Branch
 *        tags:
 *          - Branch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/addBranch'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addBranch'
 *        responses:
 *          200:
 *            description: Branch added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/addBranch'
 *                example:
 *                  error: false
 *                  message: "Create Branch: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/addBranch'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
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
 *            description: Server error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/addBranch'
 *                example:
 *                  error: true
 *                  message: "Server Error: Create Branch"
 */
router.post('/addBranch', isLoggedIn, branchController.createBranch);

/**
 *  @swagger
 *  paths:
 *    /branch/v1/deleteBranch:
 *      post:
 *        summary: Delete Existing Branch
 *        tags:
 *          - Branch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showDelSingleBranch'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showDelSingleBranch'
 *        responses:
 *          200:
 *            description: Branch deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/deleteBranch'
 *                example:
 *                  error: false
 *                  message: "Delete Branch: Succeed"
 *          400:
 *            description: Cannot delete - Branch has active employees
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/deleteBranch'
 *                example:
 *                  error: true
 *                  message: "Delete Branch: Failed - Branch has active employees"
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
 *            description: Server error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/deleteBranch'
 *                example:
 *                  error: true
 *                  message: "Server Error: Delete Branch"
 */
router.post('/deleteBranch', isLoggedIn, branchController.deleteBranch);

/**
 *  @swagger
 *  paths:
 *    /branch/v1/updateBranch:
 *      post:
 *        summary: Update Existing Branch
 *        tags:
 *          - Branch
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateBranch'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateBranch'
 *        responses:
 *          200:
 *            description: Branch updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/updateBranch'
 *                example:
 *                  error: false
 *                  message: "Update Branch: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/updateBranch'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
 *                  details: ["API Detailed Message"]
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
 *            description: Server error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/updateBranch'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Branch"
 */
router.post('/updateBranch', isLoggedIn, branchController.updateBranch);

module.exports = router;
