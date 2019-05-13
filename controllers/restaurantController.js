const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');
const apiKey = 'AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE';

router.get('/', async (req, res, next) => {
	try{
		const response = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurants+in+Chicago&key=${apiKey}`);
		console.log('this is req.body: ', req.session);
		const restaurantsList = await response.json();
		for (let i = 0; i > response.body.results.length; i++){
			const placeId = response.body.results[i].place_id;
			const responseDetails = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&fields=opening_hours,periods&key=${apiKey}`);
		};
		// const allRestaurants = await response.json({
		// 	status: 200,
		// 	data: allRestaurants
		// });
		// const restaurantsDetails = await response.json({
		// 	status: 200,
		// 	data: restaurantsDetails
		// });
		// now that you have performed a search for restaurants in the city of Chicago
		// perform a place details search with the following format:

		// const responseDetails = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=[INSERTPLACEIDHERE]&fields=opening_hours,periods&key=AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE');
		// responseDetails.json = await response.json();

	}catch(err){
		next(err)
	}
});

module.exports = router;