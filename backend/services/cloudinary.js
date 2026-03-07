const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload an audio file (ElevenLabs voice note) and return public URL
async function uploadAudio(filePath, publicId) {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'video', // Cloudinary uses 'video' for audio files
    public_id: publicId,
    folder: 'roots/audio'
  });
  return result.secure_url;
}

// Upload an image (Pulse graphics) and return public URL
async function uploadImage(filePath, publicId) {
  const result = await cloudinary.uploader.upload(filePath, {
    resource_type: 'image',
    public_id: publicId,
    folder: 'roots/graphics'
  });
  return result.secure_url;
}

// Upload from a buffer (for dynamically generated graphics)
async function uploadBuffer(buffer, publicId, resourceType = 'image') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: resourceType,
        public_id: publicId,
        folder: 'roots/graphics'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

module.exports = { uploadAudio, uploadImage, uploadBuffer };