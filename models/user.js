const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/restaurants'
const Restaurant = require('./restaurant.js');

const UserSchema = new mongoose.Schema({
	userName: { type: String, required: true},
	password: {type: String, required: true},
	email: {type: String, required: true}
});

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