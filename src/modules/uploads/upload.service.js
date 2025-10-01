const { v2: cloudinary } = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

const UploadService = {
  uploadBase64Image: async (base64Data, folder = 'uploads') => {
    const res = await cloudinary.uploader.upload(base64Data, {
      folder,
      resource_type: 'image',
      overwrite: false,
    })

    return {
      url: res.secure_url,
      publicId: res.public_id,
      format: res.format,
      bytes: res.bytes,
      width: res.width,
      height: res.height,
    }
  },

  uploadBuffer: function (buffer, folder = 'uploads', filename) {
    const ext = (filename && filename.split('.').pop()) || 'png'
    const base64 = `data:image/${ext};base64,${buffer.toString('base64')}`
    return this.uploadBase64Image(base64, folder)
  }

}

module.exports = UploadService;
