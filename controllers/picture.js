const multer = require('multer');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { uploadImage } = require('../utilities/image/uploadImage');
const { processImage } = require('../utilities/image/imageProcessor');
const { checkMimeType } = require('../utilities/image/typeChecker');
const { updateUserProfile } = require('../db/func/picture/updateUserProfile');
const { updateCompanyProfile } = require('../db/func/picture/updateCompanyProfile');
const { selectUserProfile } = require('../db/func/picture/selectUserProfile');
const { deleteImage, deleteImageByUrl } = require('../utilities/image/deleteImage');
const { selectCompanyProfile } = require('../db/func/picture/selectCompanyProfile');
const { selectMenuProfile } = require('../db/func/picture/selectMenuProfile');
const { updateMenuProfile } = require('../db/func/picture/UpdateMenuProfile');
const { selectBranchProfile } = require('../db/func/picture/selectBranchProfile');
const { updateBranchProfile } = require('../db/func/picture/updateBranchProfile');
const { selectEmployeeProfile } = require('../db/func/picture/selectEmployeeProfile');
const { updateEmployeeProfile } = require('../db/func/picture/UpdateEmployeeProfile');

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadUserProfile = upload.single('profilePic');

exports.handleUploadUserProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No file uploaded or wrong field name',
      });
    }
    // Check MIME type of the uploaded file
    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    if (!checkMimeType(req.file)) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Invalid File Type',
      });
    }

    // Process image (resize, crop, convert)
    const processedFile = await processImage(req.file);
    // Build filename using user ID
    const folderName = 'user-pic';
    const userId = value.id;
    // Delete Previous Image if Exist
    const existingProfile = await selectUserProfile(userId);
    if (existingProfile) {
      await deleteImage(existingProfile, folderName);
    }
    const fileName = `user-${userId}-${Date.now()}.png`;

    // Upload the processed image to Google Cloud Storage
    await uploadImage(processedFile, fileName, folderName);
    await updateUserProfile(userId, fileName);
    return res.status(200).json({
      error: false,
      message: 'Upload User Profile: Success',
    });
  } catch (err) {
    console.error('Upload User Profile Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Upload User Profile',
    });
  }
};

exports.uploadCompanyProfile = upload.single('companyPic');
exports.handleUploadCompanyProfile = async (req, res) => {
  try {
    // Decode Company Id
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const { companyid } = decoded;
    // Check File
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: No file uploaded or wrong field name',
      });
    }
    if (!checkMimeType(req.file)) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Invalid File Type',
      });
    }

    // Process image (resize, crop, convert)
    const processedFile = await processImage(req.file);
    const folderName = 'company-pic';

    // Delete Previous Image If Exist
    const existingProfile = await selectCompanyProfile(companyid);
    if (existingProfile) {
      await deleteImage(existingProfile, folderName);
    }
    // Build filename using Company ID
    const fileName = `company-${companyid}-${Date.now()}.png`;

    // Upload the processed image to Google Cloud Storage
    await uploadImage(processedFile, fileName, folderName);

    await updateCompanyProfile(companyid, fileName);

    return res.status(200).json({
      error: false,
      message: 'Upload Company Profile: Success',
    });
  } catch (err) {
    console.error('Upload Company Profile Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Upload Company Profile',
    });
  }
};

exports.uploadMenuImage = upload.single('menuPic');

exports.handleUploadMenuImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No file uploaded or wrong field name',
      });
    }
    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    if (!checkMimeType(req.file)) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Invalid File Type',
      });
    }

    const processedFile = await processImage(req.file);
    const folderName = 'menu-pic';
    const menuId = value.id;
    const existingMenu = await selectMenuProfile(menuId);
    if (existingMenu) {
      await deleteImageByUrl(existingMenu);
    }

    const fileName = `menu-${menuId}-${Date.now()}.png`;
    const url = await uploadImage(processedFile, fileName, folderName);
    await updateMenuProfile(menuId, url);

    return res.status(200).json({
      error: false,
      message: 'Upload Menu Image: Success',
    });
  } catch (err) {
    console.error('Upload Menu Image Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Upload Menu Image',
    });
  }
};

exports.uploadBranchImage = upload.single('branchPic');

exports.handleUploadBranchImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No file uploaded or wrong field name',
      });
    }
    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    if (!checkMimeType(req.file)) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Invalid File Type',
      });
    }

    const processedFile = await processImage(req.file);
    const folderName = 'branch-pic';
    const branchId = value.id;
    const existingBranch = await selectBranchProfile(branchId);
    if (existingBranch) {
      await deleteImageByUrl(existingBranch);
    }

    const fileName = `branch-${branchId}-${Date.now()}.png`;
    const url = await uploadImage(processedFile, fileName, folderName);
    await updateBranchProfile(branchId, url);

    return res.status(200).json({
      error: false,
      message: 'Upload Branch Image: Success',
    });
  } catch (err) {
    console.error('Upload Branch Image Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Upload Branch Image',
    });
  }
};

exports.uploadEmployeeImage = upload.single('employeePic');

exports.handleUploadEmployeeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: true,
        message: 'No file uploaded or wrong field name',
      });
    }
    const schema = Joi.object({
      id: Joi.number().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Validation',
        details: error.details.map((x) => x.message),
      });
    }
    if (!checkMimeType(req.file)) {
      return res.status(400).json({
        error: true,
        message: 'Bad Request: Invalid File Type',
      });
    }

    const processedFile = await processImage(req.file);
    const folderName = 'employee-pic';
    const employeeId = value.id;
    const existingEmployee = await selectEmployeeProfile(employeeId);
    if (existingEmployee) {
      await deleteImageByUrl(existingEmployee);
    }

    const fileName = `employee-${employeeId}-${Date.now()}.png`;
    const url = await uploadImage(processedFile, fileName, folderName);
    await updateEmployeeProfile(employeeId, url);

    return res.status(200).json({
      error: false,
      message: 'Upload Employee Image: Success',
    });
  } catch (err) {
    console.error('Upload Employee Image Error:', err);
    return res.status(500).json({
      error: true,
      message: 'Server Error: Upload Employee Image',
    });
  }
};
