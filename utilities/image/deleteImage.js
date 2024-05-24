// deleteImage.js
const { Storage } = require('@google-cloud/storage');
const url = require('url');

const storage = new Storage({ keyFilename: process.env.GCLOUD_KEYFILE });
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

exports.deleteImage = async (fileName, folderName) => {
  const filePath = `${folderName}/${fileName}`;
  const blob = bucket.file(filePath);
  try {
    await blob.delete();
    console.log('Image deleted');
    return 'Image Deleted';
  } catch (err) {
    console.error('Delete Image Error:', err);
    throw new Error(`Failed to delete Image, error: ${err.message}`);
  }
};

exports.deleteImageByUrl = async (imageUrl) => {
  const parsedUrl = new url.URL(imageUrl);
  const filePath = parsedUrl.pathname.slice(1).replace(`${bucket.name}/`, '');

  const blob = bucket.file(filePath);
  try {
    await blob.delete();
    console.log(`Image deleted: ${filePath}`);
    return 'Image Deleted';
  } catch (err) {
    console.error('Delete Image Error:', err);
    throw new Error(`Failed to delete image at ${filePath}, error: ${err.message}`);
  }
};
