const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) return null;

  try {
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authMiddleware;
