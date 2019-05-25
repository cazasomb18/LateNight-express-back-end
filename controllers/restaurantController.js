const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Comment = require('../models/comment')
require('isomorphic-fetch');
require('es6-promise').polyfill();
// const apiKey = 'AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE';


//// PURPOSE OF THIS ROUTE = INITIAL API FETCH TO RETURN ALL RESTAURANTS IN 
//// CHICAGO W/IN 5KM RADIUS W/ KEYWORDS: 'LATE' + 'NIGHT'///////////////////

/// GET '/' restaurants index - returns all restaurants in Chicago ///
router.get('/', async (req, res, next) => {
	try{
		const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.8781,-87.6298&radius=5000&type=restaurant&keyword=open&keyword=late&key=' + process.env.API_KEY);

		console.log('this is req.body: ', req.body);

		const allRestaurants = await response.json()

		JSON.stringify(allRestaurants)

		res.json(allRestaurants)

	}catch(err){

		next(err)
	}
});
/////////////// END of GET '/' restaurants show route//////////////

///PURPOSE OF THIS ROUTE = GATHER PLACE_ID IN ORDER TO FETCH 2ND API CALL WHICH WILL RETURN
///DETAILED INFORMATION ABOUT THAT PARTICULAR RESTAURANT THE USER SELECTED/////////

///////////////GET '/:id' restaurants show route -- returns details about restaurants
router.get('/:place_id', async (req, res, next) => {
	try {
		console.log(req.session, "this is req.session")
		console.log('+++++++++++++++++++++++++++++')
		console.log('HITTING restaurants GET /:place_ID ROUTE')
		console.log('this is req.body: ', req.body)
		console.log('==============================')
		const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.params.place_id + '&fields=opening_hours/periods&key=' + process.env.API_KEY)

		console.log('===========THIS IS RESPONSE++++++++++++')
		console.log(response);
		console.log('===========THIS IS RESPONSE++++++++++++')

		const parsedRestDeetResponse = await response.json();

		JSON.stringify(parsedRestDeetResponse);

		res.json(parsedRestDeetResponse);

	}catch(err){
		console.log(err);
		console.error(err);
	}
});
//////////////////////END of GET '/:place_id' restaurants show route//////////////////////

//// DO I NEED ANOTHER RESTAURANT POST ROUTE WHICH WILL CREATE THE DB ENTRY?

/// THEN THIS ROUTE BELOW WILL HAVE THE SOLE FUNCTION .POPULATING THE COMMENTS TO RESTAURANT/PLACE_ID?


///PURPOSE OF THIS ROUTE = 1.) create mongoDB entry when route is hit 
///						   2.) populate comments on that db entry
/////////////////////start of POST '/:place_id/comment' restaurants route///////////////
router.post('/:place_id/comment', async (req, res, next) => {
	try{
		console.log('===========================');
		console.log('HITTING POST ROUTE RESTAURANT/PLACE_ID/COMMENT');
		console.log('===========================');
		let theRestaurant;
		const foundRestaurant = await Restaurant.findOne({place_id: req.params.place_id});
		console.log("Found Restaurant: ", foundRestaurant);
		///find mongoDB entry after created and populate with/comments
		const restaurantId = await Restaurant.findOne({place_id: req.params.place_id});
		///get place_id from mongoDB and store it in restaurantId variable
		if(!foundRestaurant) {
			///create mongoDB entry when route is hit
			const createdRestaurant = await Restaurant.create({

				name: req.body.name,
				address: req.body.address,
				place_id: req.params.place_id

			})
			theRestaurant = createdRestaurant;
			console.log("Created Restaurant: ", createdRestaurant);
		} else {
			theRestaurant = foundRestaurant;
			const createdComment = await Comment.create({

					commentBody: req.body.commentBody,
					commentAuthor: req.body.commentAuthor

				})
			console.log(theRestaurant);
			theRestaurant.comments.push(createdComment);
			await theRestaurant.save();
			}; 
			if (restaurantId === await Restaurant.findOne({place_id: req.params.place_id})){
				////// if place_id === mongoDB place_id//////
				///then log the following to console...///
				console.log('======================================================');
				console.log(`${createdRestaurant} <==== createdRestaurant in GET'/restaurant/:place_id ROUTE`);
				console.log('======================================================');
				JSON.stringify(createdRestaurant);
				res.status(200).json({
						restaurant: theRestaurant, newComment: createdComment
				});
				/// and stringify/ send res.json...
		} else {
			console.log('=======================');
			console.log('no restaurant ID found!');
			console.log('=======================');
		}
	}catch(err) {
		next(err);
		console.error(err);
		console.log(err);
	}
});
/////////////////////END of POST '/:place_id/comment' restaurants route///////////////


module.exports = router;