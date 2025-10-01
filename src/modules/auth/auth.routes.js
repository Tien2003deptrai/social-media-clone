const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');

router.post('/google', AuthController.googleAuth);

router.post('/refresh', AuthController.refreshToken);

router.post('/logout', AuthController.logout);

module.exports = router;
