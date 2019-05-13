const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight'

const restaurantSchema = new mongoose.Schema({
	name: String,
	address: String,
	openLate: Boolean,
	//if opening_hours > 2200x
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