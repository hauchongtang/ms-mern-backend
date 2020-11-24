const createJWT = require(`${__base}utils/createJWT`)

const createSession = async (obj) => {
  try {
    let tokenInfo = {
      userId: obj.userId,
      email: obj.email,
    }

    const jwt = await createJWT(tokenInfo)
    return jwt
  } catch (err) {
    console.log(err)
  }
}

module.exports = createSession
