const express = require('express');
const authController = require('../controllers/auth.js');

const router = express.Router();

/**
 * @swagger
 * /auth/v1/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate a user and provide a JWT token
 *     parameters:
 *       - name: apikey
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           format: password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: '12345678'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: '12345678'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Login successful'
 *                 token:
 *                   type: string
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
 *                 credentials:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: '123'
 *       400:
 *         description: Bad request due to validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Validation error'
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized due to invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized: Invalid API KEY'
 *       500:
 *         description: Server error during login process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Server Error: Login'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/v1/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user in the system
 *     parameters:
 *       - name: apikey
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *           format: password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 description: Company name
 *                 example: 'Company XYZ'
 *               name:
 *                 type: string
 *                 description: Full name of the user
 *                 example: John Doe
 *               nickname:
 *                 type: string
 *                 description: Nickname for the user
 *                 example: Johnny
 *               phone:
 *                 type: string
 *                 pattern: '+62{9,12}'
 *                 description: Phone number with country code
 *                 example: '+628123456789'
 *               role:
 *                 type: string
 *                 description: User role
 *                 enum: ['general_manager', 'area_manager', 'store_manager']
 *                 example: 'general_manager'
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *                 example: 'securePassword123'
 *               passwordConfirm:
 *                 type: string
 *                 description: Confirmation of the password
 *                 example: 'securePassword123'
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               company:
 *                 type: string
 *                 example: 'Company XYZ'
 *               name:
 *                 type: string
 *                 example: John Doe
 *               nickname:
 *                 type: string
 *                 example: Johnny
 *               phone:
 *                 type: string
 *                 example: '+628123456789'
 *               role:
 *                 type: string
 *                 example: 'general_manager'
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *               password:
 *                 type: string
 *                 example: 'securePassword123'
 *               passwordConfirm:
 *                 type: string
 *                 example: 'securePassword123'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: 'Account registered'
 *       400:
 *         description: Bad request due to validation error, company name or email already used
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Bad Request: Validation or Company name/Email Used'
 *       401:
 *         description: Unauthorized due to invalid API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Unauthorized: Invalid API KEY'
 *       500:
 *         description: Server error during registration process
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'Server Error: Register'
 */
router.post('/register', authController.register);

module.exports = router;
