const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const UserProfile = require('../models/UserProfile')
const { sendConfirmationEmail, sendActivatedEmail, sendForgotPassword } = require('../utils/account')
const bcrypt = require('bcryptjs')
const moment = require('moment')
const validator = require('validator')
const { v4: uuidv4 } = require('uuid')
const generateUUID = require('../utils/generateUUID')
const UserKey = require('../models/UserKey')


require('dotenv').config()

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/users/:id', (req, res) => {
  const _id = req.params.id

  User.findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(400).send()
      }

      res.send(user)
    })
    .catch((e) => {
      res.status(500).send()
    })
})

router.get('/activation/:activationKey', async (req, res) => {
  const { activationKey } = req.params

  if (!activationKey) {
    return res.status(400).send()
  }

  const user = await User.findOne({ activationKey })
  console.log(user)

  if (!user) {
    return res.status(404).send()
  }

  const { activatedDateTime, email } = user

  if (activatedDateTime) {
    return res.status(404).send()
  }

  const dateNow = Date.now().toString()

  await User.updateOne(
    { activationKey },
    { activatedDateTime: dateNow, lastUpdated: dateNow }
  )

  return res.status(200).send()
})

router.get('/forgot-password/:forgotToken', async (req, res) => {
  const { forgotToken } = req.params
  const user = await UserKey.findOne({ key: forgotToken })

  if (!user) {
    return res
      .status(200)
      .send({ error: "Wrong token "})
  }

  try {
    if (user.key === null && user.keyType === null) {
      return res
      .status(400)
      .send({ error: "Please first apply to forgot-password section."})
    } else if (!user.key === null && !user.keyType === null) {
        const { key, keyType } = user
        if (!key === forgotToken && !keyType === "forgot-password") {
          return res
            .status(400)
            .send({ error: "Forgot token not found."})
        } else if (key === forgotToken && keyType === "forgot-password") {
          return res
          .status(200)
          .send("You may change your password.")
    }}

} catch (e) {
  return res
    .status(500)
    .send()

}
})

router.post('/users', async (req, res) => {
  const { email, password } = req.body
  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/
  const dateNow = Date.now().toString()

  if (!email || !password) {
    return res
      .status(400)
      .send({ error: 'Please fill the required missing fields.' })
  } else if (!digit.test(password) || !upperLetter.test(password)) {
    return res.status(400).send({
      error:
        'Please enter at least a number and an uppercase letter with your password.',
    })
  } else if (password.length < 8) {
    return res.status(400).send({
      error: 'Please enter a password that is at least 8 or more characters.',
    })
  }

  try {
    let userExists = await User.find({ email })

    if (userExists.length > 0) {
      return res.status(400).send({ error: 'User already exists' })
    }

    let encPassword = ''
    let theSalt = await bcrypt.genSalt(10)
    encPassword = await bcrypt.hash(password, theSalt)

    let registrationRequest = {
      email,
      password: encPassword,
      lastUpdated: dateNow,
    }
    const user = new User(registrationRequest)
    await user.save()

    let upRequest = {
      userId: user._id,
    }
    const userProfile = new UserProfile(upRequest)
    await userProfile.save()
    //sendConfirmationEmail(user)
    res.status(200).send('Successful registration')
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email && !password) {
      return res
        .status(400)
        .send({ error: 'Please enter both your email and password.' })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).send({ error: 'Email does not exists. ' })
    } else if (user.email === email) {
      passwordCompare = await bcrypt.compare(password, user.password)
      if (!passwordCompare) {
        return res.status(400).send({ error: 'Wrong password. ' })
      } else if (passwordCompare) {
        const dateNow = Date.now().toString()
        // await user.updateOne({ lastUpdated: dateNow })
        const userProfile = await UserProfile.findOne({ userId: user._id })
        await userProfile.updateOne({
          lastActivity: dateNow,
          userStatus: 'online',
        })

        const token = await jwt.sign(
          { email: user.email, id: user.id },
          process.env.ACCESS_TOKEN_SECRET
        )

        return res.status(200).json({ token: token })
      }
    }
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })

  try {
    if (!validator.isEmail(email) || !email) {
      return res.status(400).send({ error: 'Please enter a valid email. ' })
    } else if (!user) {
      return res
      .status(404)
      .send({ error: 'No account found with that e-mail. ' })
    } else if (user) {
      const userK = new UserKey
      await userK.save()

      await userK.updateOne({ userId: user.id, keyType: 'forgot-password' })

      sendForgotPassword(user, userK)

      return res.status(200).send("Mail related to password renewal has been sent.")
    }
  } catch (e) {
    res.status(500).send()
  }
})

/*
router.patch('/users/:id', async (req, res) => {
    try {
        const user = await User.
    }
    catch (e) {

    }
});
*/

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
