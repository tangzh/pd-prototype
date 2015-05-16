var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	id: Number,
	user_type: string,
	updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
