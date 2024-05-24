/**
 *  @swagger
 *  components:
 *    schemas:
 *      UserProfileUpload:
 *        type: object
 *        required:
 *          - profilePic
 *          - id
 *        properties:
 *          profilePic:
 *            type: string
 *            format: binary
 *            description: The user's profile picture to upload.
 *          id:
 *            type: integer
 *            description: User's unique identifier.
 *      CompanyProfileUpload:
 *        type: object
 *        required:
 *          - companyPic
 *        properties:
 *          companyPic:
 *            type: string
 *            format: binary
 *            description: The company's profile picture to upload.
 *      MenuProfileUpload:
 *        type: object
 *        required:
 *          - menuPic
 *          - id
 *        properties:
 *          menuPic:
 *            type: string
 *            format: binary
 *            description: The menu image to upload.
 *          id:
 *            type: integer
 *            description: Menu's unique identifier.
 *      BranchProfileUpload:
 *        type: object
 *        required:
 *          - branchPic
 *          - id
 *        properties:
 *          branchPic:
 *            type: string
 *            format: binary
 *            description: The branch image to upload.
 *          id:
 *            type: integer
 *            description: Branch's unique identifier.
 *      EmployeeProfileUpload:
 *        type: object
 *        required:
 *          - employeePic
 *          - id
 *        properties:
 *          employeePic:
 *            type: string
 *            format: binary
 *            description: The employee's profile picture to upload.
 *          id:
 *            type: integer
 *            description: Employee's unique identifier.
 */
const express = require('express');
const pictureController = require('../controllers/picture');
const { isLoggedIn } = require('../controllers/auth.js');

const router = express.Router();

/**
 *  @swagger
 *  tags:
 *    - name: Picture
 *      description: Operations related to pictures
 */

/**
 *  @swagger
 *  paths:
 *    /picture/v1/uploadUserProfile:
 *      post:
 *        summary: Uploads and processes a user's profile picture
 *        tags:
 *          - Picture
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                $ref: '#/components/schemas/UserProfileUpload'
 *        responses:
 *          200:
 *            description: User profile picture uploaded successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: false
 *                    message:
 *                      type: string
 *                      example: "Upload User Profile: Success"
 *          400:
 *            description: Bad request (validation or invalid file type)
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                examples:
 *                  validationError:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Validation"
 *                  invalidFileType:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Invalid File Type"
 *          500:
 *            description: Server error during the upload process
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Upload User Profile"
 */
router.post('/uploadUserProfile', isLoggedIn, pictureController.uploadUserProfile, pictureController.handleUploadUserProfile);

/**
 *  @swagger
 *  paths:
 *    /picture/v1/uploadCompanyProfile:
 *      post:
 *        summary: Uploads and processes a Company's profile picture
 *        tags:
 *          - Picture
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                $ref: '#/components/schemas/CompanyProfileUpload'
 *        responses:
 *          200:
 *            description: Company profile picture uploaded successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: false
 *                    message:
 *                      type: string
 *                      example: "Upload Company Profile: Success"
 *          400:
 *            description: Bad request (validation or invalid file type)
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                examples:
 *                  validationError:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Validation"
 *                  invalidFileType:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Invalid File Type"
 *          500:
 *            description: Server error during the upload process
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Upload Companyu Profile"
 */
router.post('/uploadCompanyProfile', isLoggedIn, pictureController.uploadCompanyProfile, pictureController.handleUploadCompanyProfile);

/**
 *  @swagger
 *  paths:
 *    /picture/v1/uploadMenuImage:
 *      post:
 *        summary: Uploads and processes a menu image
 *        tags:
 *          - Picture
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                $ref: '#/components/schemas/MenuProfileUpload'
 *        responses:
 *          200:
 *            description: Menu image uploaded successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: false
 *                    message:
 *                      type: string
 *                      example: "Upload Menu Image: Success"
 *          400:
 *            description: Bad request (validation or invalid file type)
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                examples:
 *                  validationError:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Validation"
 *                  invalidFileType:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Invalid File Type"
 *          500:
 *            description: Server error during the upload process
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Upload Menu Image"
 */
router.post('/uploadMenuImage', isLoggedIn, pictureController.uploadMenuImage, pictureController.handleUploadMenuImage);

/**
 *  @swagger
 *  paths:
 *    /picture/v1/uploadBranchImage:
 *      post:
 *        summary: Uploads and processes a branch image
 *        tags:
 *          - Picture
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                $ref: '#/components/schemas/BranchProfileUpload'
 *        responses:
 *          200:
 *            description: Branch image uploaded successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: false
 *                    message:
 *                      type: string
 *                      example: "Upload Branch Image: Success"
 *          400:
 *            description: Bad request (validation or invalid file type)
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                examples:
 *                  validationError:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Validation"
 *                  invalidFileType:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Invalid File Type"
 *          500:
 *            description: Server error during the upload process
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Upload Branch Image"
 */
router.post('/uploadBranchImage', isLoggedIn, pictureController.uploadBranchImage, pictureController.handleUploadBranchImage);

/**
 *  @swagger
 *  paths:
 *    /picture/v1/uploadEmployeeImage:
 *      post:
 *        summary: Uploads and processes an employee's profile picture
 *        tags:
 *          - Picture
 *        security:
 *          - bearerAuth: []
 *        requestBody:
 *          required: true
 *          content:
 *            multipart/form-data:
 *              schema:
 *                $ref: '#/components/schemas/EmployeeProfileUpload'
 *        responses:
 *          200:
 *            description: Employee image uploaded successfully
 *            content:
 *              application/json:
 *                schema:
 *                  type: object
 *                  properties:
 *                    error:
 *                      type: boolean
 *                      example: false
 *                    message:
 *                      type: string
 *                      example: "Upload Employee Image: Success"
 *          400:
 *            description: Bad request (validation or invalid file type)
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                examples:
 *                  validationError:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Validation"
 *                  invalidFileType:
 *                    value:
 *                      error: true
 *                      message: "Bad Request: Invalid File Type"
 *          500:
 *            description: Server error during the upload process
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/definitions-response/regularResponse'
 *                example:
 *                  error: true
 *                  message: "Server Error: Upload Employee Image"
 */
router.post('/uploadEmployeeImage', isLoggedIn, pictureController.uploadEmployeeImage, pictureController.handleUploadEmployeeImage);

module.exports = router;
