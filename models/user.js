const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	userName: { type: String, required: true},
	password: {type: String, required: true},
	email: String,
	comments: [{type: mongoose.Schema.Types.ObjectId, 
		ref: 'Comment'
	}],
	restaurants: [{type: mongoose.Schema.Types.ObjectId, 
		ref: 'Restaurant'
	}]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;