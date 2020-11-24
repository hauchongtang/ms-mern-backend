const mongoose = require('mongoose');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');

const passwordValidator = require('password-validator');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    _id: {  
      type: String,
      default: uuidv4
    },
    email: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid. Please enter a valid email.')
        }
      }
    },
    password: {
      type: String,
      required: true
    },
    createdDate: {
      type: Date,
      default: Date.now()
    },
    activationKey: {
      type: String,
      default: uuidv4
    },
    activatedDateTime: {
      type: Date,
      default: null
    },
    lastUpdated: {
      type: Date,
      default: null
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    lastActivity: {
      type: Date,
      default: null
    }
});



const User = mongoose.model('User', userSchema);

module.exports = User;