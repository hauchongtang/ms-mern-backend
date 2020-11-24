const jwt = require('jsonwebtoken')

const createJWT = async (obj) => {
  const token = await jwt.sign(obj, process.env.JWT_SECRET, {
    expiresIn: 3000,
  })

  return token
}

module.exports = createJWT
