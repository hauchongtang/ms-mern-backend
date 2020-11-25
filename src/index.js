require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const userRouter = require('./routes/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const app = express()
app.use(cors())

app.use(express.json())

app.use('/api', userRouter)

const uri = process.env.ATLAS_URI

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

const connection = mongoose.connection
connection.once('open', () => {
  console.log('MongoDB connection has established.')
})

const PORT = process.env.PORT || 5001

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
