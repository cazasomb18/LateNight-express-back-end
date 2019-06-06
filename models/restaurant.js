const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight'

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