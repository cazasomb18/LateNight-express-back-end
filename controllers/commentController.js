const express 			= require('express');
const compression		= require('compression');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const bcrypt 			= require('bcrypt');
const session 			= require('express-session');

/// require models ///
const User 				= require('../models/user.js');
const Comment 			= require('../models/comment.js');
const Restaurant 		= require('../models/restaurant.js');
require('isomorphic-fetch');
require('es6-promise').polyfill();





//GET ALL COMMENTS MADE ON A PARTICULAR RESTAURANT///
///start of comment GET '/restaurants/show' ROUTE ///
router.get('/restaurant/:place_id', async (req, res, next) => {
	try {
		let restaurant;

		const foundRestaurant = await Restaurant.findOne({ place_id: req.params.place_id }).populate('comments').exec();

		console.log("foundRestaurant");

		if (foundRestaurant){

			restaurant = await foundRestaurant.save();

			await restaurant.save();

			res.status(200).json({
				data: restaurant
			})

		};
		if (!foundRestaurant) {

			const message = "THERE WAS NO RESTAURANT FOUND!";

			await res.status(400).json({
				data: message
			})
			console.log(message);
		};
	}catch(err){
		console.error(next(err));
	}
	
});
///END of comment GET '/restaurants/show' ROUTE ///

///EDIT COMMENTS MADE BY A USER///////
/////////////start of comment PUT '/:place_id/edit' ROUTE /////////////
router.put('/restaurant/:place_id/edit/:comment_id', async (req, res, next) => {
	try{
		const foundRestaurant = await Restaurant.findOne({ place_id: req.params.place_id}).populate('comments');
		console.log("\nTHIS IS THE FOUND RESTAURANT: \n==>", foundRestaurant);
		const foundComment = await Comment.find({place_id: req.params.place_id});
		console.log('\nTHIS IS THE FOUND COMMENT: \n==>', foundComment);
		const updatedComment = await Comment.findByIdAndUpdate(req.params.comment_id, req.body, {new: true});
		console.log("\nTHIS IS THE UPDATED COMMENT: \n==>", updatedComment);
		res.status(200).json({updatedComment});
	}catch(err){
		console.error(next(err));
	}
});
///////////////////// END of comment EDIT '/:id' ROUTE /////////////////////


///DELETE COMMENTS MADE BY A USER//////
/////////////// comment DELETE '/:id' ROUTE ///////////////
router.delete('/restaurant/:place_id/:comment_id', async (req, res, next) => {
	try{
		const foundRestaurant = await Restaurant.findOne({ place_id: req.params.place_id }).populate('comments');
		console.log('\nFOUND RESTAURANT: \n', foundRestaurant);
		console.log('\nTHESE ARE THE FOUND COMMENTS\n', foundRestaurant.comments);
		let index;
		for (let i = 0; i < foundRestaurant.comments.length; i++){
			if (foundRestaurant.comments[i]._id.toString() === req.params.comment_id) {
				index = i;
			}
		}
		foundRestaurant.comments.splice(index, 1);
		const foundUser = await User.findOne({userName: foundRestaurant.userName});

		console.log("FOUND USER: ", foundUser);
		let index2;
		for (let i = 0; i < foundUser.comments.length; i++) {
			if (foundUser.comments[i]._id.toString() === req.params.comment_id) {
				index2 = i
			}
		}
		foundUser.comments.splice(index2, 1);
		await foundUser.save()
		const deletedComment = await Comment.findByIdAndRemove(req.params.comment_id);
		console.log("+++++++++++++++++++++++");
		console.log(`${deletedComment}, <======== will be deleted by the comment DELETE ROUTE`);
		console.log("+++++++++++++++++++++++");
		console.log("\nhere's the restaurant after delete")
		console.log(foundRestaurant);
		await foundRestaurant.save();
		console.log("here is restaurant WITHOUT the ref to the comment that was deleted")
		console.log(foundRestaurant);
		res.status(200).json(deletedComment);
	}catch(err){
		console.error(next(err));
	}
});
////////////////// END of DELETE '/:id' ROUTE //////////////////


/////////comment/:_id GET ROUTE - returns a single comment based on _id/////
router.get('/:_id', async (req, res, next) => {
	try {
		const foundComment = await Comment.findById({ _id: req.params._id });
		console.log("foundComment: \n", foundComment)
		res.status(200).json({
			data: foundComment
		})
	}catch(err){
		console.error(next(err));
	}
})
//////////////// END of GET '/:_id' route


module.exports = router;