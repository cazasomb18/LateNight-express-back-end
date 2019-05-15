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

		const allRestaurants = await response.json()

		JSON.stringify(allRestaurants)

		res.json(allRestaurants)

	}catch(err){
		next(err)
	}
});
/////////////// END of GET '/' restaurants show route//////////////

///////////////GET '/:id' restaurants show route -- returns details about restaurants (hours >2200, name, address)
router.get('/:place_id', async (req, res, next) => {
	try {

		console.log('+++++++++++++++++++++++++++++');
		console.log('HITTING restaurants GET /:ID ROUTE');
		console.log('this is req.body: ', req.body);
		console.log('==============================');

		const response = await fetch('https://maps.googleapis.com/maps/api/place/details/json?placeid=' + req.params.place_id + '&fields=opening_hours/periods&key=' + apiKey);

		console.log('===========THIS IS RESPONSE++++++++++++');
		console.log(response);
		console.log('===========THIS IS RESPONSE++++++++++++');


		const restaurantDetails = await response.json();

		JSON.stringify(restaurantDetails);

		res.json(restaurantDetails);

	}catch(err){
		next(err)
	}
});
//////////////////////END of GET '/:place_id' restaurants show route//////////////////////


/////////////////////start of POST '/:place_id/comment' restaurants route///////////////
router.post('/:place_id/comment', async (req, res, next) => {
	try{

		// if mongoDB restaurant it === Restaurant.findOne({place_id: req.params.place_id});

		const createdRestaurant = await Restaurant.create(req.body);

		createdRestaurant = await Restaurant.find({})
		.populate('comments')
		.exec();

		const restaurantId = await Restaurant.findOne({place_id: req.params.place_id});

		if (restaurantId/* === Restaurant.findOne({place_id: req.params.place_id})*/){

			/// I think I need to compare the restaurantId ^^^ variable to another instance ///


			console.log('==================');
			console.log(`${createdRestaurant} <==== createdRestaurant in GET'/restaurant/:place_id ROUTE`);
			console.log('==================');

			res.json(createdRestaurant);

		}

	}catch(err){
		next(err)
	}
});
/////////////////////END of POST '/:place_id/comment' restaurants route///////////////


module.exports = router;