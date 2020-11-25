const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const userProfileSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    default: null,
  },
  lastName: {
    type: String,
    default: null,
  },
  userName: {
    type: String,
    default: null,
  },
  userStatus: {
    type: String,
    default: 'offline',
  },
  lastActivity: {
    type: Date,
    default: Date.now(),
  },
})

const UserProfile = mongoose.model('UserProfile', userProfileSchema)

module.exports = UserProfile
