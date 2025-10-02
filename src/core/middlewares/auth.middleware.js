const { fail } = require('@uniresp/core');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1]

  if (!accessToken) {
    return res.json(fail('No token provided'))
  }

  try {
    const user = jwt.verify(accessToken, process.env.JWT_SECRET)
    req.user = user
    next()
  } catch (error) {
    return res.json(fail('Invalid token'))
  }
}

module.exports = authMiddleware;
