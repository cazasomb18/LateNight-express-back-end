const express 			= require('express');
const router 			= express.Router();
const mongoose 			= require('mongoose');
const methodOverride 	= require('method-override');
const bodyParser 		= require('body-parser');
const bcrypt 			= require('bcrypt');
const session 			= require('express-session');
const User 				= require('../models/user.js');
const Comment = require('../models/comment.js');
const Restaurant = require('../models/restaurant.js');



router.post('/', async (req, res, next) => {
	try{

		console.log("==============================");
		console.log('HITTING COMMENT POST ROUTE ON RESTAURANTS/:ID ENDPOINT');
		console.log("==============================");

		console.log('This is req.session', req.session);

		if ((req.session.logged = true) && (req.session.userName = req.body.userName)){

			const comment = await Comment.create(req.body);

			const foundRestaurant = await Restaurant.findById(req.params.id);

			const commentLocation = await foundRestaurant.comments;

			commentLocation.push(comment);

			console.log("==============================");
			console.log('this is the comment location: ');
			console.log(commentLocation);
			console.log("==============================");

		};

		res.json({

			status: 200,
			data: 'Comment posted successfully'

		});

	}catch(err){

		next(err)
	}

});

module.exports = router;

