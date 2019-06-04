const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight';

const commentSchema = new mongoose.Schema({
	commentBody: String,
	commentAuthor: String,
	restaurant_id: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Restaurant'
	}]
});


///according to this I will have to populate restaurant_id within POST restaurants/:place_id/comment route... ???

// console.log("This is the comment Schema: ", commentSchema);

const Comment = mongoose.model('Comment', commentSchema);

// console.log("This is the Comment Model: ", Comment);

module.exports = Comment;