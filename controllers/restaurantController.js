const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Comment = require('../models/comment')
const User = require('../models/user')
require('dotenv').config();
require('isomorphic-fetch');
require('es6-promise').polyfill();
const NodeGeocoder = require('node-geocoder');
const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

const options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: apiKey,
	formatter: null
}

const geocoder = NodeGeocoder(options);

/// GET '/' restaurants GETS all DATA for ALL restaurants matching query ///
router.get('/', async (req, res, next) => {
	try{
		const response = await fetch(apiUrl + apiKey);
		const allRestaurants = await response.json()
		console.log('this is req.body: ', allRestaurants);
		res.json({
			status: 200,
			data: allRestaurants.results
		})
	}catch(err){
		next(err)
		console.error(err);
	}
});
/////////////// END of GET '/' restaurants show route//////////////


///// restaurants/nearby GET route '/' this is the geolocation backend api call /////
router.get('/nearby', async (req, res, next) => {
	try{
		let lat = req.query.searchTerm;
		let nearbySearchResponse = await fetch(process.env.GEO_LOC_API_URL + req.query.searchTerm + process.env.GEO_LOC_API_FIELDS + process.env.API_KEY);
		let parsedNearbyResponse = await nearbySearchResponse.json();
		let resultLatLng;
		//if search results w/in 2k yield no results then broaden the radius to 10k///
		if (parsedNearbyResponse.status === 'ZERO_RESULTS') {

			nearbySearchResponse = await fetch(process.env.GEO_LOC_API_URL + req.query.searchTerm + process.env.GEO_LOC_API_FIELDS_LARGER + process.env.API_KEY);

			parsedNearbyResponse = await nearbySearchResponse.json();

			// photoIDs = await parsedNearbyResponse.results.map(i => {
			// 	return parsedNearbyResponse.results[i].photos[0].photo_reference;
			// })

			resultLatLng = await parsedNearbyResponse.results.map((props, i) => {
				return parsedNearbyResponse.results[i].geometry.location;
			});

			JSON.stringify(parsedNearbyResponse, resultLatLng);

			res.json({
				status: 200,
				data: parsedNearbyResponse,
				resultLatLng: resultLatLng
			})

		};

		resultLatLng = await parsedNearbyResponse.results.map((props, i) => {
			return parsedNearbyResponse.results[i].geometry.location;
		});

		JSON.stringify(parsedNearbyResponse, resultLatLng);

		res.json({
			status: 200,
			data: parsedNearbyResponse,
			resultLatLng: resultLatLng
		})
		console.log("restaurants/nearby GET REQUEST SUCCESSFUL");

	}catch(err){
		console.error(err)
	}
})
///// END OF restaurants/nearby GET route '/ /////


///PURPOSE OF THIS ROUTE = 1.) create mongoDB entry when route is hit 
///						   2.) populate comments on that db entry
/////////////////////start of POST '/:place_id/comment' restaurants route///////////////
router.post('/:place_id/comment', async (req, res, next) => {
	try{
		let theRestaurant;
		let theComment;

		const foundRestaurant = await Restaurant.findOne({ place_id: req.params.place_id });

		console.log("\nFound Restaurant: ", foundRestaurant);
		console.log("\nreq.body: ", req.body);

		if (!foundRestaurant) {

			const createdRestaurant = await Restaurant.create({

				name: req.body.name,
				address: req.body.address,
				place_id: req.params.place_id,
				userName: req.body.commentAuthor

			})

			theRestaurant = createdRestaurant;

			console.log(`\nCreated Restaurant: ${createdRestaurant} <==== we have just created this restaurant in GET'/restaurant/:place_id ROUTE`);

			const createdComment = await Comment.create({

				commentBody: req.body.commentBody,
				commentAuthor: req.body.commentAuthor,
				restaurant_name: theRestaurant.name,
				restaurant_id: theRestaurant._id

			})

			createdRestaurant.comments.push(createdComment);

			await createdRestaurant.save();

			theComment = createdComment;

			const foundUser = await User.findOne({ userName: req.body.commentAuthor });

			foundUser.comments.push(createdComment);

			await foundUser.save();

			console.log('\n=========var foundUser saved======');

			res.status(200).json({

				restaurant: theRestaurant,
				newComment: theComment,
				ok: true

			})

		} if (foundRestaurant) {

			const createdComment = await Comment.create({

					commentBody: req.body.commentBody,
					commentAuthor: req.body.commentAuthor,
					restaurant_name: foundRestaurant.name,
					restaurant_id: foundRestaurant._id

				})

			foundRestaurant.comments.push(createdComment);

			await foundRestaurant.save();

			console.log("\n============ var foundRestaurant saved ============");
			
			res.status(200).json({

				restaurant: foundRestaurant, 
				newComment: theComment,
				ok: true

			})
		}
	}catch(err) {
		next(err);
		console.error(err);
	}
});
/////////////////////END of POST '/:place_id/comment' restaurants route///////////////

/// GET '/:place_id' restaurants GETS all DATA for ALL restaurants matching query ///
router.get('/:place_id', async (req, res, next) => {
	try{
		const foundRestaurant = await Restaurant.findOne({ place_id: req.params.place_id });

		if (foundRestaurant){

			console.log(`\nfoundRestaurant: ${foundRestaurant}`);

			res.json({
				status: 200,
				data: foundRestaurant
			})
		}

		if (!foundRestaurant) {

			const message = "NO RESTAURANT FOUND!";

			res.json({
				status: 400,
				data: message
			})

			console.log(message);
		}

	}catch(err){
		console.error(next(err));
		console.error(err);
	}
});
/////////////// END of GET '/' restaurants show route//////////////


module.exports = router;