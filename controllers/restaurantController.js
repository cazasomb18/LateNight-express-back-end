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
		res.status(200).json({
			data: allRestaurants.results
		})
	}catch(err){
		console.error(next(err));
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

			res.status(200).json({
				data: parsedNearbyResponse,
				resultLatLng: resultLatLng,
				ok: true
			})

		};

		resultLatLng = await parsedNearbyResponse.results.map((props, i) => {
			return parsedNearbyResponse.results[i].geometry.location;
		});

		JSON.stringify(parsedNearbyResponse, resultLatLng);

		res.status(200).json({
			data: parsedNearbyResponse,
			resultLatLng: resultLatLng
		})
		console.log("restaurants/nearby GET REQUEST SUCCESSFUL");

	}catch(err){
		console.error(next(err));
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
				restaurant_id: theRestaurant.id

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
				newComment: theComment

			})

		} if (foundRestaurant) {

			const createdComment = await Comment.create({

					commentBody: req.body.commentBody,
					commentAuthor: req.body.commentAuthor,
					restaurant_name: foundRestaurant.name,
					restaurant_id: foundRestaurant.id

				})

			foundRestaurant.comments.push(createdComment);

			await foundRestaurant.save();

			console.log("\n============ var foundRestaurant saved ============");
			
			res.status(200).json({

				restaurant: foundRestaurant, 
				newComment: theComment

			})
		}
	}catch(err) {
		console.error(next(err));
	}
});
/////////////////////END of POST '/:place_id/comment' restaurants route///////////////

/// GET '/:place_id'  show route - restaurant data for a single mongoDB entry in Restaurant collection ///
///// if no db entry then run googles places detail api w/ the place_id and create one in mongoDB and send result///
router.get('/:place_id', async (req, res, next) => {
	try{
		const foundRestaurant = await Restaurant.findOne({ place_id: req.params.place_id });

		if (foundRestaurant){

			res.status(200).json({
				data: foundRestaurant,
			})
		}

		if (!foundRestaurant) {

			let placesDetailResponse = await fetch(process.env.PLACES_DETAIL_URL + req.params.place_id + '&key=' + process.env.API_KEY);

			let parsedDetailResponse = await placesDetailResponse.json();

			if (parsedDetailResponse) {

				let response = parsedDetailResponse.result;

				let newRestaurant = {};

				const createdRestaurant = await Restaurant.create({

					name: response.name,
					address: response.vicinity + ", " + response.address_components[5].long_name,
					place_id: response.place_id,

				});

				console.log("\n<======== NEW RESTAURANT CREATED ========>");
				console.log("\n\n\n", createdRestaurant, "\n\n\n");

				await createdRestaurant.save();

				newRestaurant = createdRestaurant;

				res.status(200).json({
					data: newRestaurant
				})

			}

			if (!parsedDetailResponse) {
				message = "Google Places Detail API query yielded no results with " + req.params.place_id;
				res.status(400).json({
					data: message
				})
				console.log(message);
			}
		}


	}catch(err){
		console.error(next(err));
	}
});
/////////////// END of GET '/:place_id' restaurants show route//////////////



// ////// GET '/restaurant/:place_id,' show restaurant details on google places API
// router.get('/restaurant/details/:place_id', async (req, res, next) => {
// 	try{
// 		let placesDetailResponse = await fetch(process.env.PLACES_DETAIL_URL + req.params.place_id + '&key=' + process.env.API_KEY)
// 		console.log("\napi call successful!")
// 		let parsedDetailResponse = await placesDetailResponse.json();
// 		console.log("\nparsing successful!\n", parsedDetailResponse);
// 		const restaurant = parsedDetailResponse.result;
// 		res.status(200).json({
// 			data: restaurant
// 		})
// 		console.log("\nREQUEST SUCCESSFUL!");
// 	}catch(err){
// 		console.error(next(err));
// 	}
// })


module.exports = router;