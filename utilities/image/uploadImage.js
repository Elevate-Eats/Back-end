// imageUploader.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({ keyFilename: process.env.GCLOUD_KEYFILE });
const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

exports.uploadImage = async (file, fileName, folderName) => {
  // Include the folder name in the file path
  const filePath = `${folderName}/${fileName}`;
  const blob = bucket.file(filePath);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      // Update the public URL to reflect the folder structure
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
      resolve(publicUrl);
    });

    const buffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
    blobStream.end(buffer);
  });
};
