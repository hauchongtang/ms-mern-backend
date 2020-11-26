const jwt = require('jsonwebtoken')
const UserProfile = require('../models/UserProfile')

module.exports = function (req, res, next) {
  // Get token from the header
  const token = req.header('x-auth-token')

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const userProfile = await UserProfile.findOne({id: decoded.id})

    if (!userProfile) {
      return res.status(500).send()
    }

    await userProfile.updateOne({
      lastActivity: Date.now().toString,
      userStatus: 'online'
    })
    next()
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
