const express = require('express')
const router = express.Router()
const multer = require('multer')
const UploadController = require('./upload.controller')

const upload = multer({ storage: multer.memoryStorage() })

router.post('/image', UploadController.uploadImage)

router.post('/image/file', upload.single('file'), UploadController.uploadImageFile)

module.exports = router


