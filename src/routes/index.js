const express = require('express')
const router = express.Router()

router.use('/users', require('@/modules/users/user.routes'))
router.use('/auth', require('@/modules/auth/auth.routes'))
router.use('/posts', require('@/modules/posts/post.routes'))


// ==== ERROR ROUTES ====
router.use('/errors', require('@/error/_routes'))

module.exports = router
