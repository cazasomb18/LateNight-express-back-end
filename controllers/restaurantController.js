const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const apiKey = 'AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE';

router.get('/', async (req, res, next) => {
	try{
		const response = await fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Chicago&key=' + apiKey);
		console.log('this is req.body: ', req.session);
		// const restaurantsList = await response.json();
		// for (let i = 0; i > response.length; i++){

		// 	let placeId = response.results[i].place_id;

		// };
		const restaurants = await response.json()
		JSON.stringify(restaurants)
		res.json(restaurants)
	}catch(err){
		next(err)
	}
});



			// const responseDetails = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + placeId + '&fields=opening_hours.periods[open{{day}, {time: > 2200}}]&key=' + apiKey);

module.exports = router;