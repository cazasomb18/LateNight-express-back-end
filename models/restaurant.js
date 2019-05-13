const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight'

const restaurantSchema = new mongoose.Schema({
	name: String,
	description: String,
	openLate: Boolean,
	//if opening_hours > 2200
	openNow: Boolean
});

console.log("");
console.log("");
console.log("");
console.log("THIS IS THE RESTAURANT SCHEMA: ");

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

console.log("");
console.log("");
console.log("");
console.log("THIS IS THE RESTAURANT MODEL: ");

module.exports = Restaurant;