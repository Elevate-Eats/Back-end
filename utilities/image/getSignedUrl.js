const { Storage } = require('@google-cloud/storage');

// Initialize storage instance with the keyfile
const storage = new Storage({ keyFilename: process.env.GCLOUD_KEYFILE });

const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

// Function to generate a signed URL with folder name included
exports.generateSignedUrl = async (folderName, fileName) => {
  // Check if folderName or fileName is empty or not provided
  if (!folderName || !fileName) {
    return null;
  }

  const filePath = `${folderName}/${fileName}`;
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  try {
    const [url] = await bucket
      .file(filePath)
      .getSignedUrl(options);

    return url;
  } catch (error) {
    console.error('Failed to generate signed URL:', error);
    throw error;
  }
};
