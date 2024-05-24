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

module.exports = router;
