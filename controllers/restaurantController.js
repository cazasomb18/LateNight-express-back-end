const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Comment = require('../models/comment')
require('dotenv').config();
require('isomorphic-fetch');
require('es6-promise').polyfill();
const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

//// PURPOSE OF THIS ROUTE = FETCH PLACE_ID from all restaurants in area w/ kws: Late + night + restaurants

/// GET '/' restaurants GETS all place_ids for restaurants matching query ///
router.get('/', async (req, res, next) => {
	try{
		const response = await fetch(apiUrl + apiKey);
		const allRestaurants = await response.json()
		const parsedResponse = JSON.stringify(allRestaurants);
		JSON.stringify(allRestaurants)
		console.log('this is req.body: ', allRestaurants);
		res.json({
			status: 200,
			data: 'restaurants have been found: ', allRestaurants
		})
	}catch(err){
		next(err)
		console.error(err);
		console.log(err);
	}
});
/////////////// END of GET '/' restaurants show route//////////////


///////////////GET '/:id' restaurants show route -- returns details about restaurants
	///PURPOSE OF THIS ROUTE = GATHER PLACE_ID IN ORDER TO FETCH 2ND API CALL WHICH WILL RETURN
	///DETAILED INFORMATION ABOUT THAT PARTICULAR RESTAURANT THE USER SELECTED/////////
router.get('/:place_id', async (req, res, next) => {
	try {
		console.log(req.session, "this is req.session")
		console.log('+++++++++++++++++++++++++++++')
		console.log('HITTING restaurants GET /:place_ID ROUTE')
		console.log('this is req.body: ', req.body)
		console.log('==============================')
		const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.params.place_id + '&fields=name,formatted_address,place_id&key=' + apiKey);
		const parsedRestDeetResponse = await response.json();
		JSON.stringify(parsedRestDeetResponse);
		res.json(parsedRestDeetResponse);
		console.log('===========THIS IS RESPONSE++++++++++++')
		console.log(parsedRestDeetResponse);
		console.log('===========THIS IS RESPONSE++++++++++++')
	}catch(err){
		console.log(err);
		console.error(err);
	}
});
//////////////////////END of GET '/:place_id' restaurants show route//////////////////////


///PURPOSE OF THIS ROUTE = 1.) create mongoDB entry when route is hit 
///						   2.) populate comments on that db entry
/////////////////////start of POST '/:place_id/comment' restaurants route///////////////
router.post('/:place_id/comment', async (req, res, next) => {
	try{
		///make sure that the fetch is set up to grab from the correct place in state///
		console.log('===========================');
		console.log('HITTING POST ROUTE RESTAURANT/PLACE_ID/COMMENT');
		console.log('===========================');
		let theRestaurant;
		let theComment;
		const foundRestaurant = await Restaurant.findOne({place_id: req.params.place_id});
		console.log("Found Restaurant: ", foundRestaurant);
		///find mongoDB entry after created and populate with/comments
		const restaurantId = await Restaurant.findOne({place_id: req.params.place_id});
		///get place_id from mongoDB and store it in restaurantId variable

		if (!foundRestaurant) {

			///create mongoDB entry when route is hit if no restaurant found
			const createdRestaurant = await Restaurant.create({

				name: req.body.name,
				address: req.body.vicinity,
				place_id: req.params.place_id

			})
			theRestaurant = createdRestaurant;
			console.log("Created Restaurant: ", createdRestaurant);
			console.log('======================================================');
			console.log(`${createdRestaurant} <==== createdRestaurant in GET'/restaurant/:place_id ROUTE`);
			console.log('======================================================');
			const createdComment = await Comment.create({

				restaurant_id: foundRestaurant.id,
				commentBody: req.body.commentBody,
				commentAuthor: req.session.userName

			})
			console.log("foundRestaurant updated with new comments");
			console.log(foundRestaurant);
			foundRestaurant.comments.push(createdComment);
			await foundRestaurant.save();
			theComment = createdComment;
			console.log('=========var theRestaurant saved======');
		} else if (foundRestaurant) {
			const createdComment = await Comment.create({

					restaurant_id: foundRestaurant.id,
					commentBody: req.body.commentBody,
					commentAuthor: req.session.userName

				})
			console.log("foundRestaurant updated with new comments");
			console.log(foundRestaurant);
			foundRestaurant.comments.push(createdComment);
			await foundRestaurant.save();
			theComment = createdComment;
			console.log('=========var theRestaurant saved======');
		};

	if (req.params.place_id === foundRestaurant.place_id){
			////// if place_id === mongoDB place_id//////
			///then log the following to console...///

			console.log('======HITTING THIS BLOCK?!?!=========');
			JSON.stringify(foundRestaurant);
			res.status(200).json({
					restaurant: foundRestaurant, newComment: theComment
			})
			console.log('foundRestaurant: ', foundRestaurant, 'has been updated with comment: ', theComment);
				/// and stringify/ send res.json...

		} else {
			if(!restaurantId){
				console.log('=======================');
				console.log('no restaurant ID found!');
				console.log('=======================');
			}
		}
	}catch(err) {
		next(err);
		console.error(err);
		console.log(err);
	}
});
/////////////////////END of POST '/:place_id/comment' restaurants route///////////////


module.exports = router;