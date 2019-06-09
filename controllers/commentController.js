/// node modules ///
const express 			= require('express');
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
/// require models ///




///FUNCTION OF THIS ROUTE IS TO GET ALL COMMENTS MADE ON A PARTICULAR RESTAURANT///
///start of comment GET '/restaurants/show' ROUTE ///

////there is an issue here - this route is returning ALL COMMENTS made.////
router.get('/restaurants/:place_id', async (req, res, next) => {
	try {
		let theRestaurant;
		console.log('This is req.session', req.session);

		console.log('+++++++++++++++++++++');
		console.log('HITTING COMMENT GET ROUTE ON RESTAURANTS/:PLACE_ID ENDPOINT');
		console.log('+++++++++++++++++++++');

		const foundRestaurant = await Restaurant.find({place_id: req.params.place_id}).populate('comments');
		console.log(foundRestaurant);

		if (foundRestaurant){
			const foundComments = await Comment.find({place_id: req.params.comments});
			// const foundComments = await Comment.find({place_id: req.params.place_id});
			// const foundComments = await Comment.findById({_id: req.params.place_id});
			console.log("================");
			console.log({foundComments}, " <====== comments found on " + req.params.id + " GET restaurants/:place_id route");
			// const foundComments = await Comment.find(req.params.id);

			console.log('THESE ARE THE FOUND COMMENTS');
			// const foundComments = await Comment.find({place_id: req.params.id});

			console.log("================");
			console.log(foundComments, " <====== comments found on " + req.params.place_id + " GET restaurants/:place_id route");
			console.log("================");
			await res.json({
				status: 200,
				data: 'comments found on restaurant place_id: ' + req.params.place_id + " in GET restaurants/:place_id route"
			})

		} else {
			console.log('THERE WAS NO RESTAURANT FOUND');
			await res.json({
				status: 400,
				data: "no restaurant could be found"
			})
		}

	}catch(err){
		next(err)
	}
	
});
///END of comment GET '/restaurants/show' ROUTE ///


//////PURPOSE OF THIS ROUTE IS FOR USERS TO EDIT COMMENTS///////
/////////////start of comment PUT '/:place_id/edit' ROUTE /////////////
router.put('/restaurants/:place_id/edit/:comment_id', async (req, res, next) => {
	try{

		console.log('This is req.session', req.session);

		console.log('+++++++++++++++++++++');
		console.log('HITTING COMMENT PUT ROUTE ON RESTAURANTS/:PLACE_ID/EDIT ENDPOINT');
		console.log('+++++++++++++++++++++');

		// let editedComment;

		const foundRestaurant = await Restaurant.findOne({place_id: req.params.place_id}).populate('comments');

		console.log(foundRestaurant);
		console.log('THIS IS THE FOUND RESTAURANT');

		const foundComment = await Comment.find({place_id: req.params.id});
		console.log('THESE ARE THE FOUND COMMENTS');
		console.log(foundComment);
		// console.log(foundRestaurant.comments);

		const updatedComment = await Comment.findByIdAndUpdate(req.params.comment_id, req.body, {new: true});

		console.log("THIS IS THE UPDATED COMMENT: ", updatedComment);

		// const updatedComment = await Comment.findByIdAndUpdate({place_id: req.params.id, req.body, new: true});

		console.log("==================");
		console.log(`${{updatedComment}} <=========== has been found in comment PUT '/:place_id/edit ROUTE`);
		console.log("==================");

		// JSON.stringify(updatedComment);

		res.status(200).json({updatedComment});

	}catch(err){
		next(err)
	}
});
///////////////////// END of comment EDIT '/:id' ROUTE /////////////////////


///PURPOSE OF THIS ROUTE IS TO DELETE COMMENTS MADE BY A USER//////
/////////////// comment DELETE '/:id' ROUTE ///////////////
router.delete('/restaurants/:place_id/:comment_id', async (req, res, next) => {
	try{
		const foundRestaurant = await Restaurant.findOne({place_id: req.params.place_id}).populate('comments');
		// const foundComments  = await Comment.find({place_id: req.params.place_id});
		console.log('FOUND RESTAURANT: ', foundRestaurant);
		console.log('THESE ARE THE FOUND COMMENTS', foundRestaurant.comments);
		
		let index;

		for (let i = 0; i < foundRestaurant.comments.length; i++){
			if (foundRestaurant.comments[i]._id.toString() === req.params.comment_id) {
				index = i;
			}
		}
		
		foundRestaurant.comments.splice(index, 1);


		const foundUser = await User.findOne({userName: req.session.userName});

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
		next(err)
	}
});
////////////////// END of DELETE '/:id' ROUTE //////////////////


module.exports = router;