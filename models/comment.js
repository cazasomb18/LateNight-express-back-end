const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

const commentSchema = new mongoose.Schema({
	commentBody: String,
	commentAuthor: String,
	restaurant_name: String,
	restaurant_id: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant'
	}]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;