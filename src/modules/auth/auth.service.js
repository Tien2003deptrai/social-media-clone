const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('@/modules/users/user.model');

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

const AuthService = {
  verifyGoogleToken: async (token) => {
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.OAUTH_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    } catch (error) {
      throw new Error('Invalid Google token');
    }
  },

  generateToken: (payload, type) => {
    const expiry = type === 'access' ? '15m' : '7d';
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: expiry }
    );
    return token;
  },

  findOrCreateUser: async (googlePayload) => {
    const { name, email, picture } = googlePayload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        picture,
        status: 'active',
        role: 'user',
        provider: 'google',
      });

      await user.save();
    }

    return user;
  },

  authenticateWithGoogle: async (credential) => {
    try {
      const googlePayload = await AuthService.verifyGoogleToken(credential);

      const user = await AuthService.findOrCreateUser(googlePayload);

      const userPayload = { id: user._id, email: user.email };
      const refreshToken = AuthService.generateToken(userPayload, 'refresh');
      const accessToken = AuthService.generateToken(userPayload, 'access');

      return {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          role: user.role,
          status: user.status
        },
        tokens: {
          accessToken,
          refreshToken
        }
      };
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }
};

module.exports = AuthService;
