const mongoose = require('mongoose');

const connectionString = 'mongodb://localhost/lateNight';

const commentSchema = new mongoose.Schema({
	commentBody: String,
	commentAuthor: String
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;