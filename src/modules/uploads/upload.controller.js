const { ok } = require('@uniresp/core')
const { SystemError } = require('@uniresp/errors')
const UploadService = require('./upload.service')

const UploadController = {
  uploadImage: async (req, res, next) => {
    try {
      const { image, folder } = req.body || {}
      if (!image) throw new SystemError('VALIDATION.MISSING_IMAGE', 'image (base64 or URL) is required')

      const result = await UploadService.uploadBase64Image(image, folder)
      return res.json(ok({ image: result }, { message: 'Upload successful' }))
    } catch (err) {
      next(err)
    }
  },

  uploadImageFile: async (req, res, next) => {
    try {
      const file = req.file
      const folder = req.body?.folder
      if (!file) throw new SystemError('VALIDATION.MISSING_FILE', 'file is required (form-data)')

      const result = await UploadService.uploadBuffer(file.buffer, folder, file.originalname)
      return res.json(ok({ image: result }, { message: 'Upload successful' }))
    } catch (err) {
      next(err)
    }
  },
}

module.exports = UploadController;


