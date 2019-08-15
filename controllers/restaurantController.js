const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const Comment = require('../models/comment')
const User = require('../models/user')
require('dotenv').config();
require('isomorphic-fetch');
require('es6-promise').polyfill();
const apiUrl = process.env.API_URL;
const apiKey = process.env.API_KEY;

/// GET '/' restaurants GETS all DATA for ALL restaurants matching query ///
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
	}
});
/////////////// END of GET '/' restaurants show route//////////////


///// restaurants/nearby GET route '/' this is the geolocation backend api call /////
router.get('/nearby', async (req, res, next) => {
	try{
		let lat = req.query.searchTerm;
		console.log(lat);
		console.log('^-- Query');
		const nearbySearchResponse = await fetch(process.env.GEO_LOC_API_URL + req.query.searchTerm + process.env.GEO_LOC_API_FIELDS + process.env.API_KEY);
		parsedNearbyResponse = await nearbySearchResponse.json();
		JSON.stringify(parsedNearbyResponse);
		res.json({
			status: 200,
			data: parsedNearbyResponse
		})
		console.log(parsedNearbyResponse)
	}catch{
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
		const foundRestaurant = await Restaurant.findOne({place_id: req.params.place_id});
		console.log("Found Restaurant: ", foundRestaurant);
		const restaurantId = await Restaurant.findOne({place_id: req.params.place_id});
		if (!foundRestaurant) {
			const createdRestaurant = await Restaurant.create({

				name: req.body.name,
				address: req.body.vicinity,
				place_id: req.params.place_id,
				userName: req.session.userName

			})

			theRestaurant = createdRestaurant;
			console.log("Created Restaurant: ", createdRestaurant);
			console.log('======================================================');
			console.log(`${createdRestaurant} <==== we have just created this restaurant in GET'/restaurant/:place_id ROUTE`);
			console.log('======================================================');
			const createdComment = await Comment.create({

				commentBody: req.body.commentBody,
				commentAuthor: req.session.userName,
				restaurant_name: theRestaurant.name,
				restaurant_id: theRestaurant.id

			})
			console.log('this restaurant didn\'t exist, we just created it: ', createdRestaurant);
			createdRestaurant.comments.push(createdComment);
			await createdRestaurant.save();
			theComment = createdComment;
			const foundUser = await User.findOne({userName: req.session.userName})
			console.log("\n we just tried to find the user based on session: ", foundUser);
			foundUser.comments.push(createdComment)
			await foundUser.save()
			console.log('=========var theRestaurant saved======');

			JSON.stringify(createdRestaurant);
			res.status(200).json({

				restaurant: createdRestaurant, newComment: theComment

			})
		} if (foundRestaurant) {
			const createdComment = await Comment.create({

					restaurant_id: foundRestaurant._id,
					restaurant_name: foundRestaurant.name,
					commentBody: req.body.commentBody,
					commentAuthor: req.session.userName

				})
			console.log("foundRestaurant updated with new comments: ", foundRestaurant);
			foundRestaurant.comments.push(createdComment);
			await foundRestaurant.save();
			console.log('=========var theRestaurant saved======');
			theComment = createdComment;
			JSON.stringify(foundRestaurant);
			res.status(200).json({
					restaurant: foundRestaurant, 
					newComment: theComment,
					ok: true
			})
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
	}
});
/////////////////////END of POST '/:place_id/comment' restaurants route///////////////


module.exports = router;