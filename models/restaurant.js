const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
	name: String,
	description: String,
	openLate: Boolean,
	openNow: Boolean
});

module.exports = mongoose.model('Restaurant', restaurantSchema);