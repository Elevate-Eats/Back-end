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
 *          - name
 *          - salary
 *          - bonus
 *          - branchId
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
 *      updateEmployeesBranch:
 *        type: object
 *        required:
 *          - employeeIds
 *          - branchId
 *        properties:
 *          employeeIds:
 *            type: array
 *            description: An array of Employee IDs to update their branch ID
 *            items:
 *              type: number
 *          branchId:
 *            type: integer
 *            description: The new Branch ID to assign to all listed employees
 *        example:
 *          employeeIds: [10, 14, 20]
 *          branchId: 3
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
 *            description: Keyword to search employees
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            description: Limit the number of employees returned
 *          - in: query
 *            name: unassigned
 *            schema:
 *              type: integer
 *            description: 1 to find employees unassigned to any branch
 *        responses:
 *          200:
 *            description: Employee data retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Employee Data Fetch: Succeed"
 *                  employeeData: [...]
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
 *            description: No employees found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Employee Data Fetch: No Data Found"
 *          500:
 *            description: Server error fetching employees
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show All Employees"
 */
router.get('/showEmployees', isLoggedIn, employeeController.showEmployees);

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
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelEmployee'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelEmployee'
 *        responses:
 *          200:
 *            description: A single employee retrieved successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Employee Data Fetch: Succeed"
 *                  employeeData: {...}
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
 *            description: Employee not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Employee not found"
 *          500:
 *            description: Server error fetching employee data
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Show Single Employee"
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
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/addEmployee'
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
 *                  message: "Create Employee: Succeed"
 *          400:
 *            description: Validation error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Bad Request: Validation"
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
 *            description: Server error adding employee
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Create Employee"
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
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/showSingleDelEmployee'
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
 *                  message: "Delete Employee: Succeed"
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
 *            description: Server error deleting employee
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Delete Employee"
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
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateEmployee'
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
 *                  message: "Update Employee: Succeed"
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
 *            description: Server error updating employee
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Employee"
 */
router.post('/updateEmployee', isLoggedIn, employeeController.updateEmployee);

/**
 *  @swagger
 *  paths:
 *    /employee/v1/updateEmployeesBranch:
 *      post:
 *        summary: Updates the branch assignment for multiple employees
 *        tags:
 *          - Employee
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/updateEmployeesBranch'
 *            application/x-www-form-urlencoded:
 *              schema:
 *                $ref: '#/components/schemas/updateEmployeesBranch'
 *        responses:
 *          200:
 *            description: Employees' branch updated successfully
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: false
 *                  message: "Update Employees Branch ID: Succeed"
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
 *            description: Server error updating employees' branches
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Update Employees Branch"
 */
router.post('/updateEmployeesBranch', isLoggedIn, employeeController.updateEmployeesBranch);
module.exports = router;
