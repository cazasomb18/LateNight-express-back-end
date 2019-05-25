const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	userName: { type: String, required: true},
	password: {type: String, required: true},
	email: String,
	comments: [{type: mongoose.Schema.Types.ObjectId, 
		ref: 'Comment'
	}]
});



// console.log("");
// console.log("");
// console.log("");
// console.log("THIS IS THE USER SCHEMA: ", UserSchema);

const User = mongoose.model('User', UserSchema);

// console.log("");
// console.log("");
// console.log("");
// console.log("USER MODEL: ", User);

module.exports = User;