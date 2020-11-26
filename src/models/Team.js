const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const TeamSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  ownerId: {
    type: String,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  projectId: {
    type: String,
    required: true,
  },
})

const Team = mongoose.model('Team', TeamSchema)

module.exports = Team
