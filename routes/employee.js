/**
 *  @swagger
 *  components:
 *    schemas:
 *      addEmployee:
 *        type: object
 *        required:
 *          - name
 *          - salary
 *          - bonus
 *        properties:
 *          name:
 *            type: string
 *            description: Name of the Employee
 *          salary:
 *            type: number
 *            description: Salary of the Employee
 *          bonus:
 *            type: number
 *            description: Bonus of the Employee
 *        example:
 *          name: John Doe
 *          salary: 5000
 *          bonus: 500
 *      updateEmployee:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: integer
 *            description: Employee ID
 *          name:
 *            type: string
 *            description: Name of the Employee
 *          salary:
 *            type: number
 *            description: Salary of the Employee
 *          bonus:
 *            type: number
 *            description: Bonus of the Employee
 *          branchId:
 *            type: integer
 *            description: Branch ID Which the Employee is Assigned
 *        example:
 *          id: 10
 *          name: John Doe
 *          salary: 5000
 *          bonus: 500
 *          branchId: 5
 *      showSingleDelEmployee:
 *        type: object
 *        required:
 *          - id
 *        properties:
 *          id:
 *            type: integer
 *            description: EmployeeID
 */

/**
 *  @swagger
 *  tags:
 *    - name: Employee
 *      description: Operations about employees
 */

const express = require('express');
const { isLoggedIn } = require('../controllers/auth.js');
const employeeController = require('../controllers/employee.js');

const router = express.Router();

/**
 *  @swagger
 *  paths:
 *    /employee/v1/showEmployees:
 *      get:
 *        summary: Returns a list of employees
 *        tags:
 *          - Employee
 *        security:
 *          - bearerAuth: []
 *        parameters:
 *          - in: query
 *            name: search
 *            schema:
 *              type: string
 *            description: Find Employee Data base of Keyword
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Show limited Number of Employees
 *          - in: query
 *            name: Employee
 *            schema:
 *              type: integer
 *            description: Find Employee Data base of EmployeeID
 *        responses:
 *          200:
 *            description: Employee Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: employee data retrieved successfully
 *                  employeeData:
 *                    - id: 1
 *                      name: "Santoso"
 *                      salary: 500
 *                      bonus: 100
 *          404:
 *            description: Employee not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: employee not found
 *          500:
 *            description: Failed to Fetch Employee
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to fetch employee data
 */
router.get('/showEmployees', isLoggedIn, employeeController.showAllEmployee);

/**
 *  @swagger
 *  paths:
 *    /employee/v1/showSingleEmployee:
 *      post:
 *        summary: Returns a single employee by ID
 *        tags:
 *          - Employee
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelEmployee'
 *        responses:
 *          200:
 *            description: A single employee object
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: employee data retrieved successfully
 *                  employeeData:
 *                    id: 10
 *                    name: John Doe
 *                    Address: "Jl. Godean, Godean, Yogyakarta, DIY"
 *                    manager: nothibg
 *          404:
 *            description: Employee not Found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: employee not found
 *          500:
 *            description: Fetch Data Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: Failed to fetch employee data
 */
router.post('/showSingleEmployee', isLoggedIn, employeeController.showSingleEmployee);

/**
 *  @swagger
 *  paths:
 *    /employee/v1/addEmployee:
 *      post:
 *        summary: Adds a new employee
 *        tags:
 *          - Employee
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/addEmployee'
 *        responses:
 *          200:
 *            description: Employee added successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: Employee added
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
 *            description: Employee add Failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to add Employee
 */
router.post('/addEmployee', isLoggedIn, employeeController.createEmployee);

/**
 *  @swagger
 *  paths:
 *    /employee/v1/deleteEmployee:
 *      post:
 *        summary: Deletes an employee by ID
 *        tags:
 *          - Employee
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelEmployee'
 *        responses:
 *          200:
 *            description: Employee deleted successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: Employee deleted
 *          500:
 *            description: Employee deletion failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to delete Employee
 */
router.post('/deleteEmployee', isLoggedIn, employeeController.deleteEmployee);

/**
 *  @swagger
 *  paths:
 *    /employee/v1/updateEmployee:
 *      post:
 *        summary: Updates an existing employee
 *        tags:
 *          - Employee
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateEmployee'
 *        responses:
 *          200:
 *            description: Employee updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: Employee updated
 *          500:
 *            description: Employee update failed
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: failed to update Employee
 */
router.post('/updateEmployee', isLoggedIn, employeeController.updateEmployee);

module.exports = router;
