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
const Comment = require('../models/comment.js');
const Restaurant = require('../models/restaurant.js');
/// require models ///

///start of comment GET '/restaurants/show' ROUTE ///
router.get('/restaurants/:id', async (req, res, next) => {
	try {
		console.log('This is req.session', req.session);

		console.log('+++++++++++++++++++++');
		console.log('HITTING COMMENT GET ROUTE ON RESTAURANTS/:PLACE_ID ENDPOINT');
		console.log('+++++++++++++++++++++');


		const foundComment = await Comment.findById({_id: req.params.id});
		console.log("================");
		console.log(`${foundComment}, <====== has been found in the GET restaurants/:place_id route`);
		console.log("================");

		res.json({
			status: 200,
			data: foundComment
		});
	}catch(err){
		next(err)
	}
	
});
///END of comment GET '/restaurants/show' ROUTE ///


/// start of comment POST '/:id' ROUTE ///
router.post('restaurants/:id', async (req, res, next) => {
	try{

		console.log("==============================");
		console.log('HITTING COMMENT POST ROUTE ON RESTAURANTS/:ID ENDPOINT');
		console.log("==============================");

		console.log('This is req.session', req.session);

		if ((req.session.logged = true) && (req.session.userName = req.body.userName)){

			const createdComment = await Comment.create(req.body);

			const foundRestaurant = await Restaurant.findById(req.params.id);

			const commentLocation = await foundRestaurant.comments;

			commentLocation.push(comment);

			console.log("==============================");
			console.log('this is the comment location: ');
			console.log(commentLocation);
			console.log("==============================");

			await foundRestaurant.save();

		};

		res.json({
			status: 200,
			data: 'Comment posted successfully'

		});

	}catch(err){

		next(err)
	}

});
/// END of comment POST '/:id' ROUTE ///

///start of comment EDIT '/:id' ROUTE ///
router.put('restaurants/:id/edit', async (req, res, next) => {
	try{
		const updatedComment = await Comment.findByIdAndUpdate(req.params.id, req.body, {new: true});
		console.log("==================");
		console.log(`${updatedComment}, <=========== has been found in comment PUT '/:id/edit ROUTE`);
		console.log("==================");
		res.json({
			status: 200,
			data: foundComment
		})
	}catch{
		next(err)
	}
});
/// END of comment EDIT '/:id' ROUTE ///

/// comment DELETE '/:id' ROUTE ///
router.delete('restaurants/:id', async (req, res) => {
	try{
		const deletedComment = await Comment.findByIdAndRemove(req.params.id);
		console.log("+++++++++++++++++++++++");
		console.log(`${deletedComment}, <======== will be deleted by the comment DELETE ROUTE`);
		console.log("+++++++++++++++++++++++");

	}catch(err){
		next(err)
	}
});
/// END of DELETE '/:id' ROUTE ///


module.exports = router;

