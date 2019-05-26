const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Comment = require('../models/comment')
require('dotenv').config();
require('isomorphic-fetch');
require('es6-promise').polyfill();

const apiKey = process.env.API_KEY;

///original api query: https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.8781,-87.6298&radius=5000&type=restaurant&keyword=open&keyword=late&key=' + apiKey


///this query returns all restaurnts w/ kws: "restaurants" "open" "late" 
///https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=apiKey&input=late%20night%20restaurants&inputtype=textquery&locationbias=ipbias///

///this query returns individual restaurant details w/ fields of: "name" "formatted_address" & "url" (url is a googlemaps link... i think...)
///https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJi_wOTFwsDogRc254g-wUOIk&key=AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE&fields=name,formatted_address,url///

//// PURPOSE OF THIS ROUTE = FETCH PLACE_ID from all restaurants in area w/ kws: Late + night + restaurants

/// GET '/' restaurants GETS all place_ids for restaurants matching query ///
router.get('/', async (req, res, next) => {
	try{
		const response = await fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=' + apiKey + '&input=late%20night%20restaurants&inputtype=textquery&locationbias=ipbias');
		console.log('this is req.body: ', req.body);
		const allPlaceIds = await response.json()
		const parsedResponse = JSON.stringify(allPlaceIds);
		JSON.stringify(allPlaceIds)
		res.json({
			status: 200,
			data: 'place_ids have been found for: ', allPlaceIds
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
		const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.params.place_id + '&fields=name,formatted_address,url&key=' + apiKey);
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


///PURPOSE OF THIS ROUTE = 1.) create mongoDB entry when route is hit 
///						   2.) populate comments on that db entry
/////////////////////start of POST '/:place_id/comment' restaurants route///////////////
router.post('/:place_id/comment', async (req, res, next) => {
	try{
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
				address: req.body.address,
				place_id: req.params.place_id

			})
			theRestaurant = createdRestaurant;
			console.log("Created Restaurant: ", createdRestaurant);
			console.log('======================================================');
			console.log(`${createdRestaurant} <==== createdRestaurant in GET'/restaurant/:place_id ROUTE`);
			console.log('======================================================');

		} else if (foundRestaurant) {

			theRestaurant = foundRestaurant;
			const createdComment = await Comment.create({

					commentBody: req.body.commentBody,
					commentAuthor: req.body.commentAuthor

				})
			console.log("foundRestaurant updated with new comments");
			console.log(theRestaurant);
			theRestaurant.comments.push(createdComment);
			await theRestaurant.save();
			theComment = createdComment;
			console.log('=========var theRestaurant saved======');

		};

	if (req.params.place_id === theRestaurant.place_id){
			////// if place_id === mongoDB place_id//////
			///then log the following to console...///

			console.log('======HITTING THIS BLOCK?!?!=========');
			JSON.stringify(theRestaurant);
			res.status(200).json({
					restaurant: theRestaurant, newComment: theComment
			})
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