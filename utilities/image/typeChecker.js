// typeChecker.js
const mime = require('mime-types');

exports.checkMimeType = (file) => {
  console.log(`this is file ${file.originalname}`);
  const mimeType = mime.lookup(file.originalname);
  return ['image/jpeg', 'image/png'].includes(mimeType);
};
