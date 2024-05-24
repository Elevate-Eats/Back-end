const multer = require('multer');
const Joi = require('joi');
const { uploadImage } = require('../utilities/image/uploadImage');
const { processImage } = require('../utilities/image/imageProcessor');
const { checkMimeType } = require('../utilities/image/typeChecker');
const { updateUserProfile } = require('../db/func/picture/updateUserProfile');

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
    console.log(req.file.originalname);
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
    const userId = value.id;
    const fileName = `user-${userId}-${Date.now()}.png`;

    // Upload the processed image to Google Cloud Storage
    const folderName = 'user-pic';
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
