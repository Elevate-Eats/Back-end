// typeChecker.js
const mime = require('mime-types');

exports.checkMimeType = (file) => {
  const mimeType = mime.lookup(file.originalname);
  return ['image/jpeg', 'image/png'].includes(mimeType);
};
