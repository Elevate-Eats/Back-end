/**
 *  @swagger
 *  components:
 *    schemas:
 *      showSingleBranch:
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
 *      deleteBranch:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: integer
 *            description: Branch ID
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
 *          id: 10
 *          name: Jogja
 *          address: Jl. Godean, Godean, Yogyakarta, DIY
 *          phone: "\uFF0B628533513111"
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
 *  components:
 *    securitySchemes:
 *      bearerAuth:
 *        type: http
 *        scheme: bearer
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
 *        summary: Show Data Branches
 *        tags:
 *          - Branch
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Search Parameter of Branches
 *        responses:
 *          200:
 *            description: Success
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showBranches'
 *                example:
 *                  error: false
 *                  message: Branch data retrieved successfully
 *                  branchData:
 *                    id: 10
 *                    name: "Jogjakarta"
 *                    address: "Jl. Godean, Godean, Yogyakarta, DIY"
 *          404:
 *            description: Retrieval Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showBranches'
 *                example:
 *                  error: true
 *                  message: Branch not found
 */
router.get('/showBranches', isLoggedIn, branchController.showAllBranch);

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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleBranch'
 *        responses:
 *          200:
 *            description: Success
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showSingleBranch'
 *                example:
 *                  error: false
 *                  message: Branch data retrieved successfully
 *                  branchData:
 *                    id: 10
 *                    name: "Jogjakarta"
 *                    address: "Jl. Godean, Godean, Yogyakarta, DIY"
 *          404:
 *            description: Retrieval Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/showSingleBranch'
 *                example:
 *                  error: true
 *                  message: Branch not found
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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addBranch'
 *        responses:
 *          200:
 *            description: Success
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/addBranch'
 *                example:
 *                  error: false
 *                  message: Branch added
 *          400:
 *            description: Validation Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/addBranch'
 *                example:
 *                  error: true
 *                  message: Validation error
 *                  details: 'API Detailed Message'
 *          500:
 *            description: Validation Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/addBranch'
 *                example:
 *                  error: true
 *                  message: Failed to Add Branch
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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/deleteBranch'
 *        responses:
 *          200:
 *            description: Success
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/deleteBranch'
 *                example:
 *                  error: false
 *                  message: Branch deleted
 *          500:
 *            description: Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/deleteBranch'
 *                example:
 *                  error: false
 *                  message: failed to delete branch
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
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateBranch'
 *        responses:
 *          200:
 *            description: Success
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/updateBranch'
 *                example:
 *                  error: false
 *                  message: Branch updated
 *          500:
 *            description: Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/updateBranch'
 *                example:
 *                  error: false
 *                  message: failed to update branch
 */
router.post('/updateBranch', isLoggedIn, branchController.updateBranch);

module.exports = router;
