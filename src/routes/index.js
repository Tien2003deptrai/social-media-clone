const express = require('express')
const router = express.Router()

router.use('/users', require('@/modules/users/user.routes'))
router.use('/auth', require('@/modules/auth/auth.routes'))


// ==== ERROR ROUTES ====
router.use('/errors', require('@/error/_routes'))

module.exports = router
