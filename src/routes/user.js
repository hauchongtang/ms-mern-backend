const express = require('express')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendConfirmationEmail } = require('../utils/account')
const bcrypt = require('bcryptjs')

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

  const user = await User.findOne({ activationKey })
  console.log(user)

  if (!user) {
    return res.status(400).send()
  }

  const { activatedDateTime, email } = user

  if (activatedDateTime) {
    return res.status(400).send()
  }

  const dateNow = Date.now().toString()

  await User.updateOne(
    { activationKey },
    { activatedDateTime: dateNow, lastUpdated: dateNow }
  )

  return res.status(200).send()
})

router.post('/users', async (req, res) => {
  const { email, password } = req.body
  const digit = /^(?=.*\d)/
  const upperLetter = /^(?=.*[A-Z])/

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

    console.log(userExists)

    if (userExists.length > 0) {
      return res.status(400).send({ error: 'User already exists' })
    }

    let encPassword = ''
    let theSalt = await bcrypt.genSalt(10)
    encPassword = await bcrypt.hash(password, theSalt)

    let registrationRequest = {
      email,
      password: encPassword,
    }
    const user = new User(registrationRequest)
    await user.save()
    sendConfirmationEmail(user)
    res.status(200).send('Successful registration')
  } catch (e) {
    res.status(400).send(e)
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
