const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight';

const commentSchema = new mongoose.Schema({
	commentBody: String,
	commentAuthor: String
});

// console.log("This is the comment Schema: ", commentSchemna);

const Comment = mongoose.model('Comment', commentSchema);

// console.log("This is the Comment Model: ", Comment);

module.exports = Comment;