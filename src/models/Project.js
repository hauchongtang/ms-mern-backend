const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const ProjectSchema = new mongoose.Schema({
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
  lastUpdated: {
    type: Date,
    default: null,
  },
  projectName: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: null,
  },
  endDate: {
    type: Date,
    default: null,
  },
  dueDate: {
    type: Date,
    default: null,
  },
  currentStatus: {
    type: String,
    default: null,
  },
  gitHubUrl: {
    type: String,
    default: null,
  },
})

const Project = mongoose.model('Project', ProjectSchema)

module.exports = Project
