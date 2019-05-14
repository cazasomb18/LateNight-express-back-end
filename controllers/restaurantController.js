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

		console.log('this is req.body: ', req.body);

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

		// 	response.forEach((i) => {
		// 		if (i.text() === 'place_id'){
		// 			return i;
		// 		}

		// 	});

		// const newResponse = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + i + '&fields=opening_hours,periods,close,time&key=$' + apiKey);


		console.log('===========THIS IS RESPONSE++++++++++++');
		console.log(response);
		console.log('===========THIS IS RESPONSE++++++++++++');

		console.log('===========THIS IS RESPONSE.BODY++++++++++++');
		console.log(response.body);
		console.log('===========THIS IS RESPONSE.BODY++++++++++++');

		// for (let i = 0; i < response.body.length; i++){

		// 	console.log(response.body.results[i].place_id);

		// 	const placeId = response.body.results[i].place_id;

		// 	console.log('=++==========THIS IS PLACE ID+=+++++++++');
		// 	console.log(placeId);
		// 	console.log('=++==========THIS IS PLACE ID+=+++++++++');

		// 	return placeId;

			//methods tried: 
				// forEach 
				// for loop
				// promise.all w/ two await fetch() calls and an iteration between

		// }

		// console.log("=========PLACE ID+++++++++++: ", placeId);

		// const newResponse = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=opening_hours,periods,close,time&key=${apiKey}`);

		const restaurantDetails = await response.json();

		JSON.stringify(restaurantDetails);

		res.json(restaurantDetails);

	}catch(err){
		next(err)
	}
});
///END of GET '/:id' restaurantrs show route///


module.exports = router;