const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

const restaurantSchema = new mongoose.Schema({
	name: String,
	address: String,
	place_id: String,
	userName: String,
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;