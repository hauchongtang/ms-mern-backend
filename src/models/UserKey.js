const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userKeySchema = new mongoose.Schema({
    key: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        default: null
    },
    keyType: {
        type: String,
        default: null
    }
})

const UserKey = mongoose.model('UserKey', userKeySchema);

module.exports = UserKey;