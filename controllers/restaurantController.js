const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
require('isomorphic-fetch');
require('es6-promise').polyfill();
const apiKey = 'AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE';

/// GET '/' restaurants index - returns all restaurants in Chicago ///
router.get('/', async (req, res, next) => {
	try{
		const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.8781,-87.6298&radius=5000&type=restaurant&keyword=open&keyword=late&key=' + apiKey);

		console.log('this is req.body: ', req.session);

		const restaurants = await response.json()

		JSON.stringify(restaurants)

		res.json(restaurants)

	}catch(err){
		next(err)
	}
});
/// END of GET '/' restaurants show route///

//GET '/:id' restaurants show route -- returns details about restaurants (hours >2200, name, address)
router.get('/:id', async (req, res, next) => {
	try {
		console.log('+++++++++++++++++++++++++++++');
		console.log('HITTING ROUTE GET /:ID');
		console.log('==============================');
		console.log('this is req.body: ', req.session);

		const response = await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=41.8781,-87.6298&radius=5000&type=restaurant&keyword=open&keyword=late&key=' + apiKey);

		for (let i = 0; i > response.length; i++){

			let placeId = response.length.results[i].place_id;

			// return placeId;

		};
		console.log("=========PLACE ID+++++++++++: ", placeId);

		response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}placeId}&fields=opening_hours,periods,close,time&key=${apiKey}`);

		const restaurantDetails = await response.json();

		JSON.stringify(restaurantDetails);

		res.json(restaurantDetails);

	}catch(err){
		next(err)
	}
});
///END of GET '/:id' restaurantrs show route///


module.exports = router;