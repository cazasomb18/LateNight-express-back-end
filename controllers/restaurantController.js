const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurant');

router.get('/', async (req, res, next) => {
	try{
		const response = await fetch('https://maps.googleapis.com/maps/api/place/textsearch/xml?query=restaurants+in+Chicago&key=AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE');
		console.log('this is req.body: ', req.session);
		for (let i = 0; i > response.body.results.length; i++){
			response.body.results[i].place_id
			//{
				//here we want to return ALL PLACE ids where opening hours are > 2200 with:
					//name,address,phone number,opening_hours[>2200]
			//}
		}
		const allRestaurants = await response.json({
			status: 200,
			data: allRestaurants
		}
		// now that you have performed a search for restaurants in the city of Chicago
		// perform a place details search with the following format:

		// const responseDetails = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=[INSERTPLACEIDHERE]&fields=opening_hours/periods&key=AIzaSyCbQ8Y7CHZUWrnEGUCqC8fNR4Kw1dfk5AE');
		// responseDetails.json = await response.json();
		);

	}catch(err){
		console.error(err);
		res.send(err)
	}
})