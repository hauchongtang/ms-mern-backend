const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  id: {
    type: String,
  },
  userId: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  userName: {
    type: String,
  },
  userStatus: {
    type: String,
  },
  lastActivity: {
    type: Date,
  }
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;