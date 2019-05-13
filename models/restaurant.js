const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
	name: String,
	address: String,
	openLate: Boolean,
	//if opening_hours > 2200x
	openNow: Boolean
});

module.exports = mongoose.model('Restaurant', restaurantSchema);