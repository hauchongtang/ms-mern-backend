const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userKeySchema = new mongoose.Schema.mongoose({
    key: {
        type: String,
        default: uuidv4
    },
    userId: {
        type: String,
        default: uuidv4
    },
    keyType: {
        type: String
    }
})

const UserKey = mongoose.model('UserKey', userKeySchema);

module.exports = UserKey;