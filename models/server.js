const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    id: { type: String, required: true },
    commandPrefix: { type: String, default: '!' },

    users: [{
        id: { type: String, required: true },
        username: { type: String, required: true },
        tag: { type: String, required: true },
    }],
}); 

module.exports = mongoose.model('Server', ServerSchema);
