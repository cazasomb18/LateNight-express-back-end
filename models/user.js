const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	userName: { type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true}
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