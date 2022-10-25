const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	username: { type: String, unique: true, required: true },
	otp: { type: String, },
	token: { type: String },
	avatar: { type: String },
});

const User = mongoose.model('user', userSchema);

module.exports = User;