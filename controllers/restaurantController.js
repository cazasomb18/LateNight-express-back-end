const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const apiKey = 'AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE';

/// GET '/' restaurants index - returns all restaurants in Chicago ///
router.get('/', async (req, res, next) => {
	try{
		const response = await fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Chicago&key=' + apiKey);
		console.log('this is req.body: ', req.session);
		for (let i = 0; i > response.length; i++){

			const placeId = response.results[i].place_id;

		};
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
		const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId + '&fields=opening_hours,periods,close,time&key=' + apiKey);
		console.log('this is req.body: ', req.session);
		const restaurantDetails = await response.json()
		JSON.stringify(restaurantDetails)
		res.json(restaurantDetails)
	}catch(err){
		next(err)
	}
});
///END of GET '/:id' restaurantrs show route///


module.exports = router;