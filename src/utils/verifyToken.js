const jwt = require('jsonwebtoken')

const verifyToken = async (token) => {
  try {
    const decodeToken = await jwt.verify(token, process.env.JWT_SECRET)

    return decodeToken
  } catch (err) {
    console.log(err)
    return false
  }
}

module.exports = verifyToken
