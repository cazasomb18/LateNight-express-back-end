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

router.get('/restaurant/id:/new', async (req, res, next) => {
	try{
		console.log('This is req.session', req.session);

	}catch(err){
		next(err)
	}
});

