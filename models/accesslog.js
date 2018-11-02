var mongoose = require('mongoose');

var accesslogSchema = new mongoose.Schema({
    accessedOn: { type: Date, default: Date.now() },
    IP: String,
    username: String,
});

module.exports = mongoose.model('accesslog', accesslogSchema);