const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight'

const restaurantSchema = new mongoose.Schema({
	name: String,
	address: String,
	place_id: String,
	// comments: comments.populate(); --> will have to do some research, some logic here that makes this model aware of the other model's structure
});

// console.log("");
// console.log("");
console.log("");
console.log("THIS IS THE RESTAURANT SCHEMA: ", restaurantSchema);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// console.log("");
// console.log("");
console.log("");
console.log("THIS IS THE RESTAURANT MODEL: ", Restaurant);

module.exports = Restaurant;