const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight';

const commentSchema = new mongoose.Schema({
	commentBody: String,
	commentAuthor: String
	/// will probably need to change the format of this to actually grab the mongoDB id for the restaurant///
});

// console.log("This is the comment Schema: ", commentSchema);

const Comment = mongoose.model('Comment', commentSchema);

// console.log("This is the Comment Model: ", Comment);

module.exports = Comment;