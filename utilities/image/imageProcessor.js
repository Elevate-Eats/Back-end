const sharp = require('sharp');

exports.processImage = (file) => {
  const size = 256; // Set the size of the image
  return sharp(file.buffer)
    .rotate() // Rotate based on EXIF
    .resize(size, size)
    .composite([{
      // This SVG creates a circular mask
      input: Buffer.from(
        `<svg>
          <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="black"/>
        </svg>`,
        'utf-8'
      ),
      blend: 'dest-in',
    }])
    .png() // Output as PNG to maintain transparency
    .toBuffer();
};
