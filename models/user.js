const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
	username: {type: String, required: true},

const connectionString = 'mongodb://localhost/lateNight'

// const Restaurant = require('./restaurant.js');

const UserSchema = new mongoose.Schema({
	userName: { type: String, required: true},

	password: {type: String, required: true},
	email: {type: String, required: true}
});


module.exports = mongoose.model('User', userSchema);

console.log("");
console.log("");
console.log("");
console.log("THIS IS THE USER SCHEMA: ");

const User = mongoose.model('User', UserSchema);

console.log("");
console.log("");
console.log("");
console.log("USER MODEL: ");

module.exports = User;

