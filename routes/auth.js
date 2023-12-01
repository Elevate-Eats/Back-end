/**
 *  @swagger
 *  components:
 *    schemas:
 *      register:
 *        type: object
 *        required:
 *          - name
 *          - nickname
 *          - email
 *          - company
 *          - role
 *          - password
 *        properties:
 *          name:
 *            type: string
 *            description: Your Name
 *          nickname:
 *            type: string
 *            description: Your Nickname
 *          email:
 *            type: string
 *            format: email
 *            example: user@example.com
 *            description: Your Email
 *          company:
 *            type: string
 *            type: Your Company
 *          role:
 *            type: string
 *            enum: [general_manager, area_manager, store_manager]
 *          password:
 *            type: string
 *            format: password
 *          passwordConfirm:
 *            type: string
 *            format: password
 *        example:
 *          name: Muhammad Garma
 *          nickname: Garma123
 *          email: dummy@garma.id
 *          company: Balibul
 *          role: general_manager
 *          password: IniPassword
 *          passwordConfirm: IniPassword
 *      login:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            format: email
 *            example: user@example.com
 *            description: Your Email
 *          password:
 *            type: string
 *            format: password
 *        example:
 *          email: dummy@garma.id
 *          password: IniPassword
 */

/**
 *  @swagger
 *  components:
 *    definitions-response:
 *      register:
 *        type: object
 *        properties:
 *          error:
 *            type: boolean
 *            required: true
 *          message:
 *            type: string
 *            required: true
 *      login:
 *        type: object
 *        properties:
 *          error:
 *            type: boolean
 *            required: true
 *          message:
 *            type: string
 *            required: true
 *          token:
 *            type: string
 *          nickname:
 *            type: string
 */

/**
 *  @swagger
 *  tags:
 *    - name: Accounts
 *      description: Accounts Operations
 */

const express = require('express');
const authController = require('../controllers/auth.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /auth/v1/register:
 *      post:
 *        summary: Register New Account and Company
 *        tags:
 *          - Accounts
 *        parameters:
 *          - name: apikey
 *            in: header
 *            required: true
 *            schema:
 *              type: string
 *              format: password
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/register'
 *        responses:
 *          200:
 *            description: Registered
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/register'
 *                  example:
 *                    error: false
 *                    message: Account Registered
 *          400:
 *            description: Format Incorrect
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/register'
 *                  example:
 *                    error: true
 *                    message: invalid email format
 *          409:
 *            description: Data Confict
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/register'
 *                  example:
 *                    error: true
 *                    message: Company name already used
 *          412:
 *            description: Precondition Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/register'
 *                  example:
 *                    error: true
 *                    message: Passwords does not match
 */
router.post('/register', authController.register);

/**
 *  @swagger
 *  paths:
 *    /auth/v1/login:
 *      post:
 *        summary: Login to Application
 *        tags:
 *          - Accounts
 *        consumes:
 *          - application/x-www-form-urlencoded
 *        parameters:
 *          - name: apikey
 *            in: header
 *            required: true
 *            schema:
 *              type: string
 *              format: password
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/login'
 *        responses:
 *          202:
 *            description: Accepted
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/login'
 *                  example:
 *                    error: false
 *                    message: Succesful Login
 *                    token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ
 *                    nickname: Garma123
 *          500:
 *            description: Server Error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/login'
 *                  example:
 *                    error: false
 *                    message: Server error for login
 */
router.post('/login', authController.login);
// router.post('/forgetpassword', authController.forgetpassword);
// router.post('/checkreset', authController.checkReset);
// router.get('/logout', authController.logout);

module.exports = router;
