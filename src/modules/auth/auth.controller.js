const jwt = require('jsonwebtoken');
const AuthService = require('./auth.service');
const { ok } = require('@uniresp/core');
const { SystemError } = require('@uniresp/errors');
const { asyncRoute } = require('@uniresp/server-express');

const AuthController = {
  googleAuth: asyncRoute(async (req, res, next) => {
    try {
      const { credential } = req.body;

      if (!credential) throw new SystemError('VALIDATION.MISSING_CREDENTIAL', 'Google credential is required');

      const authResult = await AuthService.authenticateWithGoogle(credential);

      res.cookie('refreshToken', authResult.tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.json(ok(
        { user: authResult.user, accessToken: authResult.tokens.accessToken },
        { message: 'Authentication successful' })
      );

    } catch (error) {
      next(error);
    }
  }),

  refreshToken: asyncRoute(async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) throw new SystemError('AUTH.NO_REFRESH_TOKEN', 'Refresh token not found');

      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const userPayload = { userId: decoded.userId, email: decoded.email };
      const newAccessToken = AuthService.generateToken(userPayload, 'access');

      return res.json(ok({ accessToken: newAccessToken }, { message: 'Token refreshed' }));

    } catch (error) {
      next(error);
    }
  }),

  logout: asyncRoute(async (req, res, next) => {
    try {
      res.clearCookie('refreshToken');

      return res.json(ok({ message: 'User logged out successfully' }, { message: 'Logout successful' }));

    } catch (error) {
      next(error);
    }
  }),
};

module.exports = AuthController;
